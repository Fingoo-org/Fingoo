import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetLiveIndicatorQuery } from './get-live-indicator.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoadLiveIndicatorPort } from '../../../port/external/twelve/load-live-indicator.port';
import {
  FredFrequency,
  IndicatorDtoType,
  Interval,
  LiveIndicatorDtoType,
} from '../../../../../utils/type/type-definition';
import { CachingLiveIndicatorPort } from '../../../port/cache/caching-live-indicator.port';
import { LoadCachedLiveIndicatorPort } from '../../../port/cache/load-cached-live-indicator.port';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';
import { LoadLiveEconomyIndicatorPort } from '../../../port/external/fred/load-live-economy-indicator.port';
import { EconomyDto } from '../../indicator/get-indicator-list/dto/economy.dto';

type RedisKeyData = { key: string; endDate: string };
const MILLISECONDS_IN_A_DAY = 86400000;
const DAYS_IN_A_WEEK = 7;
const THURSDAY_OFFSET = 4;

@Injectable()
@QueryHandler(GetLiveIndicatorQuery)
export class GetLiveIndicatorQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetLiveIndicatorQueryHandler.name);
  constructor(
    @Inject('LoadLiveIndicatorPort')
    private readonly loadLiveIndicatorPort: LoadLiveIndicatorPort,
    @Inject('LoadLiveEconomyIndicatorPort')
    private readonly loadLiveEconomyIndicatorPort: LoadLiveEconomyIndicatorPort,
    @Inject('LoadCachedLiveIndicatorPort')
    private readonly loadCachedLiveIndicatorPort: LoadCachedLiveIndicatorPort,
    @Inject('CachingLiveIndicatorPort')
    private readonly cachingLiveIndicatorPort: CachingLiveIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  async execute(query: GetLiveIndicatorQuery): Promise<LiveIndicatorDtoType> {
    const { indicatorId, startDate, interval, indicatorType } = query;

    const indicatorDto: IndicatorDtoType = await this.loadIndicatorPort.loadIndicator(indicatorId, indicatorType);

    const redisKeyData: RedisKeyData = this.createLiveIndicatorKey(indicatorDto, interval, startDate);

    let liveIndicatorDto: LiveIndicatorDtoType = await this.loadCachedLiveIndicatorPort.loadCachedLiveIndicator(
      redisKeyData.key,
    );

    if (this.isNotCached(liveIndicatorDto)) {
      if (indicatorType === 'economy' && interval === 'none') {
        const economicInterval: FredFrequency = (indicatorDto as EconomyDto).frequency;
        liveIndicatorDto = await this.loadAndCacheLiveEconomyIndicator(
          indicatorDto,
          economicInterval,
          startDate,
          redisKeyData.endDate,
          redisKeyData.key,
        );
        this.logger.log('Live indicator(FRED) 호출');
      } else {
        liveIndicatorDto = await this.loadAndCacheLiveIndicator(
          indicatorDto,
          interval,
          startDate,
          redisKeyData.endDate,
          redisKeyData.key,
        );
        this.logger.log('Live indicator(TWELVE) 호출');
      }
    }

    return liveIndicatorDto;
  }

  private async loadAndCacheLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: Interval,
    startDate: string,
    endDate: string,
    key: string,
  ): Promise<LiveIndicatorDtoType> {
    const liveIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(
      indicatorDto,
      interval,
      startDate,
      endDate,
    );
    await this.cachingLiveIndicatorPort.cachingLiveIndicator(key, liveIndicatorDto);
    return liveIndicatorDto;
  }

  private async loadAndCacheLiveEconomyIndicator(
    indicatorDto: IndicatorDtoType,
    interval: FredFrequency,
    startDate: string,
    endDate: string,
    key: string,
  ): Promise<LiveIndicatorDtoType> {
    const liveIndicatorDto = await this.loadLiveEconomyIndicatorPort.loadLiveIndicator(
      indicatorDto,
      interval,
      startDate,
      endDate,
    );
    await this.cachingLiveIndicatorPort.cachingLiveIndicator(key, liveIndicatorDto);
    return liveIndicatorDto;
  }

  private isNotCached(indicatorDto: LiveIndicatorDtoType): boolean {
    return indicatorDto == null;
  }

  private createLiveIndicatorKey(indicatorDto: IndicatorDtoType, interval: Interval, startDate: string): RedisKeyData {
    const nowEndDate = this.getEndDate();
    const endDate = this.formatDayToString(nowEndDate);
    const keyInterval = this.getKeyInterval(interval, indicatorDto);
    const redisExpiredKey = this.getRedisExpiredKey(nowEndDate, interval);

    const key = `${indicatorDto.indicatorType}/live-${indicatorDto.symbol}-interval:${keyInterval}-startDate:${startDate}-redisExpiredKey:${redisExpiredKey}`;
    return { key, endDate };
  }

  private getEndDate(): Date {
    return new Date();
  }

  private getRedisExpiredKey(currentDate: Date, interval: string): string {
    switch (interval) {
      case 'day':
        return this.formatDayToString(currentDate);
      case 'week':
        return this.formatWeekToString(currentDate);
      case 'month':
        return this.formatMonthToString(currentDate);
      case 'year':
        return this.formatYearToString(currentDate);
      default:
        return this.formatDayToString(currentDate);
    }
  }

  private getKeyInterval(interval: Interval, indicatorDto: IndicatorDtoType): string {
    if (interval === 'none') {
      return (indicatorDto as EconomyDto).frequency || '';
    }
    return interval;
  }

  private formatDayToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatWeekToString(date: Date): string {
    const year = date.getFullYear();
    const week = this.getISOWeekNumber(date);
    return `${year}-W${week}`;
  }

  private formatMonthToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private formatYearToString(date: Date): string {
    return String(date.getFullYear());
  }

  private getISOWeekNumber(date: Date): number {
    const tempDate = new Date(date.getTime());
    tempDate.setDate(tempDate.getDate() + THURSDAY_OFFSET - (tempDate.getDay() || DAYS_IN_A_WEEK));
    const yearStart = new Date(tempDate.getFullYear(), 0, 1);
    return Math.ceil(((tempDate.getTime() - yearStart.getTime()) / MILLISECONDS_IN_A_DAY + 1) / DAYS_IN_A_WEEK);
  }
}
