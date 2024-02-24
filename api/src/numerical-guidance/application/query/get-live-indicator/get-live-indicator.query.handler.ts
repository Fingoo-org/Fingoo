import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetLiveIndicatorQuery } from './get-live-indicator.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoadLiveIndicatorPort } from '../../port/external/load-live-indicator.port';
import { FluctuatingIndicatorDto } from '../get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { Interval } from '../../../../utils/type/type-definition';
import { CachingFluctuatingIndicatorPort } from '../../port/cache/caching-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../port/cache/load-cached-fluctuatingIndicator.port';
import { LoadIndicatorPort } from '../../port/persistence/indicator/load-indicator.port';

@Injectable()
@QueryHandler(GetLiveIndicatorQuery)
export class GetLiveIndicatorQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetLiveIndicatorQueryHandler.name);
  constructor(
    @Inject('LoadLiveIndicatorPort')
    private readonly loadLiveIndicatorPort: LoadLiveIndicatorPort,
    @Inject('LoadCachedFluctuatingIndicatorPort')
    private readonly loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort,
    @Inject('CachingFluctuatingIndicatorPort')
    private readonly cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  async execute(query: GetLiveIndicatorQuery): Promise<FluctuatingIndicatorDto> {
    const { indicatorId, interval } = query;

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(indicatorId);
    const { ticker, market } = indicatorDto.indicator;

    const key = this.createLiveIndicatorKey(indicatorId, interval);

    let fluctuatingIndicatorDto: FluctuatingIndicatorDto =
      await this.loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator(key);

    if (this.isNotCached(fluctuatingIndicatorDto)) {
      fluctuatingIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(ticker, interval, market);
      await this.cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator(key, fluctuatingIndicatorDto);
      this.logger.log('KRX 호출');
    }
    return fluctuatingIndicatorDto;
  }

  private isNotCached(fluctuatingIndicatorDto: FluctuatingIndicatorDto): boolean {
    return fluctuatingIndicatorDto == null;
  }

  private createLiveIndicatorKey(ticker: string, interval: Interval) {
    const today: Date = new Date();
    const date = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    return `live${ticker}${interval}${date}`;
  }
}
