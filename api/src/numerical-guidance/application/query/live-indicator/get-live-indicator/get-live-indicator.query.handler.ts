import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetLiveIndicatorQuery } from './get-live-indicator.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoadLiveIndicatorPort } from '../../../port/external/twelve/load-live-indicator.port';
import { Interval, LiveIndicatorDtoType } from '../../../../../utils/type/type-definition';
import { CachingLiveIndicatorPort } from '../../../port/cache/caching-live-indicator.port';
import { LoadCachedLiveIndicatorPort } from '../../../port/cache/load-cached-live-indicator.port';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';

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

  async execute(query: GetLiveIndicatorQuery): Promise<LiveIndicatorDtoType> {
    const { indicatorId, interval, startDate, indicatorType } = query;

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(indicatorId, indicatorType);

    const { key, endDate } = this.createLiveIndicatorKey(indicatorDto, interval, startDate);

    let liveIndicatorDto: LiveIndicatorDtoType = await this.loadCachedLiveIndicatorPort.loadCachedLiveIndicator(key);

    if (this.isNotCached(liveIndicatorDto)) {
      liveIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(indicatorDto, interval, startDate, endDate);
      await this.cachingLiveIndicatorPort.cachingLiveIndicator(key, liveIndicatorDto);
      this.logger.log('Live indicator(TWELVE) 호출');
    }
    return liveIndicatorDto;
  }

  private isNotCached(indicatorDto: LiveIndicatorDtoType): boolean {
    return indicatorDto == null;
  }

  private createLiveIndicatorKey(indicatorDto, interval: Interval, formattedStartDate: string) {
    const endDate = this.getEndDate();
    return {
      key: `${indicatorDto.indicatorType}/live${indicatorDto.symbol}${interval}${formattedStartDate}${endDate}`,
      endDate: endDate,
    };
  }

  private getEndDate(): string {
    const currentDate = new Date();
    return this.formatDateToString(currentDate);
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
