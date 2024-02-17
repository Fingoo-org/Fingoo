import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetFluctuatingIndicatorQuery } from './get-fluctuatingIndicator.query';
import { FluctuatingIndicatorDto } from './fluctuatingIndicator.dto';
import { LoadFluctuatingIndicatorPort } from '../../port/external/load-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../port/cache/load-cached-fluctuatingIndicator.port';
import { CachingFluctuatingIndicatorPort } from '../../port/cache/caching-fluctuatingIndicator.port';
import { Interval } from 'src/utils/type/type-definition';

@Injectable()
@QueryHandler(GetFluctuatingIndicatorQuery)
export class GetFluctuatingIndicatorQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetFluctuatingIndicatorQueryHandler.name);
  constructor(
    @Inject('LoadFluctuatingIndicatorPort')
    private readonly loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort,
    @Inject('LoadCachedFluctuatingIndicatorPort')
    private readonly loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort,
    @Inject('CachingFluctuatingIndicatorPort')
    private readonly cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort,
  ) {}

  async execute(getFluctuatingIndicatorQuery: GetFluctuatingIndicatorQuery): Promise<FluctuatingIndicatorDto> {
    const { dataCount, ticker, market, interval, endDate } = getFluctuatingIndicatorQuery;

    const key = this.createFluctuatingIndicatorKey(ticker, interval);

    let fluctuatingIndicatorDto: FluctuatingIndicatorDto =
      await this.loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator(key);

    if (this.isNotCached(fluctuatingIndicatorDto)) {
      fluctuatingIndicatorDto = await this.loadFluctuatingIndicatorPort.loadFluctuatingIndicator(
        dataCount,
        ticker,
        interval,
        market,
        endDate,
      );
      await this.cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator(key, fluctuatingIndicatorDto);
      this.logger.log('KRX 호출');
    }
    return fluctuatingIndicatorDto;
  }

  private isNotCached(fluctuatingIndicatorDto: FluctuatingIndicatorDto): boolean {
    return fluctuatingIndicatorDto == null;
  }

  private createFluctuatingIndicatorKey(ticker: string, interval: Interval) {
    const today: Date = new Date();
    const date = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    return `${ticker}${interval}${date}`;
  }
}
