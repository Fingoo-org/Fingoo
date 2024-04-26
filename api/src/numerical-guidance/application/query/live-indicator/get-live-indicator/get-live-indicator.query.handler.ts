import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetLiveIndicatorQuery } from './get-live-indicator.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoadLiveIndicatorPort } from '../../../port/external/krx/load-live-indicator.port';
import { LiveStockDto } from '../dto/live-stock.dto';
import { Interval } from '../../../../../utils/type/type-definition';
import { CachingLiveIndicatorPort } from '../../../port/cache/caching-live-indicator.port';
import { LoadCachedLiveIndicatorPort } from '../../../port/cache/load-cached-live-indicator.port';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';
import {
  DAY_NUMBER_OF_DAYS,
  MONTH_NUMBER_OF_DAYS,
  WEEK_NUMBER_OF_DAYS,
  YEAR_NUMBER_OF_DAYS,
} from '../../../../infrastructure/adapter/twelve/indicator.twelve.adapter';
import { LiveEtfDto } from '../dto/live-etf.dto';
import { LiveForexPairDto } from '../dto/live-forex-pair.dto';
import { LiveIndicesDto } from '../dto/live-indices.dto';
import { LiveBondsDto } from '../dto/live-bonds.dto';
import { LiveFundDto } from '../dto/live-fund.dto';

@Injectable()
@QueryHandler(GetLiveIndicatorQuery)
export class GetLiveIndicatorQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetLiveIndicatorQueryHandler.name);
  constructor(
    @Inject('LoadLiveIndicatorPort')
    private readonly loadLiveIndicatorPort: LoadLiveIndicatorPort,
    @Inject('LoadCachedLiveIndicatorPort')
    private readonly loadCachedLiveIndicatorPort: LoadCachedLiveIndicatorPort,
    @Inject('CachingLiveIndicatorPort')
    private readonly cachingLiveIndicatorPort: CachingLiveIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  async execute(
    query: GetLiveIndicatorQuery,
  ): Promise<LiveStockDto | LiveEtfDto | LiveForexPairDto | LiveIndicesDto | LiveBondsDto | LiveFundDto> {
    const { indicatorId, interval, startDate, indicatorType } = query;

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(indicatorId, indicatorType);

    const { key, endDate } = this.createLiveIndicatorKey(indicatorDto.symbol, interval, startDate);

    let liveIndicatorDto: LiveStockDto | LiveEtfDto | LiveForexPairDto | LiveIndicesDto | LiveBondsDto | LiveFundDto =
      await this.loadCachedLiveIndicatorPort.loadCachedLiveIndicator(key);

    if (this.isNotCached(liveIndicatorDto)) {
      liveIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(indicatorDto, interval, startDate, endDate);
      await this.cachingLiveIndicatorPort.cachingLiveIndicator(key, liveIndicatorDto);
      this.logger.log('Live indicator(TWELVE) 호출');
    }
    return liveIndicatorDto;
  }

  private isNotCached(indicatorDto: LiveStockDto): boolean {
    return indicatorDto == null;
  }

  private createLiveIndicatorKey(symbol: string, interval: Interval, rowStartDate: string) {
    const startDate = new Date(rowStartDate);
    const numberOfDays = this.convertIntervalToNumberOfDays(interval);
    const endDate = this.getEndDate(startDate, numberOfDays);
    return { key: `live${symbol}${interval}${rowStartDate}${endDate}`, endDate: endDate };
  }

  private getEndDate(startDate: Date, numOfDays: number): string {
    const pastDate: Date = startDate;
    pastDate.setDate(startDate.getDate() + numOfDays);
    return this.formatDateToString(pastDate);
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private convertIntervalToNumberOfDays(interval: Interval) {
    switch (interval) {
      case 'day':
        return DAY_NUMBER_OF_DAYS;
      case 'week':
        return WEEK_NUMBER_OF_DAYS;
      case 'month':
        return MONTH_NUMBER_OF_DAYS;
      case 'year':
        return YEAR_NUMBER_OF_DAYS;
    }
  }
}
