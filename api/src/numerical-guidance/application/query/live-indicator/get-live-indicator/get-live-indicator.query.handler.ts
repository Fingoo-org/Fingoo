import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetLiveIndicatorQuery } from './get-live-indicator.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { LoadLiveIndicatorPort } from '../../../port/external/krx/load-live-indicator.port';
import { LiveKRXIndicatorDto } from '../dto/live-indicator.dto';
import { Interval } from '../../../../../utils/type/type-definition';
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

  async execute(query: GetLiveIndicatorQuery): Promise<LiveKRXIndicatorDto> {
    const { indicatorId, interval } = query;

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(indicatorId);
    const { ticker, market } = indicatorDto.indicator;

    const key = this.createLiveIndicatorKey(indicatorId, interval);

    let fluctuatingIndicatorDto: LiveKRXIndicatorDto =
      await this.loadCachedLiveIndicatorPort.loadCachedLiveIndicator(key);

    if (this.isNotCached(fluctuatingIndicatorDto)) {
      fluctuatingIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(
        indicatorId,
        ticker,
        interval,
        market,
      );
      await this.cachingLiveIndicatorPort.cachingLiveIndicator(key, fluctuatingIndicatorDto);
      this.logger.log('KRX 호출');
    }
    return fluctuatingIndicatorDto;
  }

  private isNotCached(fluctuatingIndicatorDto: LiveKRXIndicatorDto): boolean {
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
