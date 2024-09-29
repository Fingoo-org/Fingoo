import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GetQuoteIndicatorQuery } from './get-quote-indicator.query';
import { IndicatorQuoteData } from './interface/quote-indicator-data.interface';
import { IndicatorDtoType } from '../../../../../utils/type/type-definition';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';
import { LoadQuoteIndicatorPort } from '../../../port/external/twelve/load-quote-indicator.port';
import { LoadCachedQuoteIndicatorPort } from '../../../port/cache/load-cached-quote-indicator.port';
import { CachingQuoteIndicatorPort } from '../../../port/cache/caching-quote-indicator.port';
import { QuoteIndicatorIntervalEnum } from '../../../../../utils/enum/enum-definition';

@Injectable()
@QueryHandler(GetQuoteIndicatorQuery)
export class GetQuoteIndicatorQueryHandler implements IQueryHandler {
  private readonly logger = new Logger(GetQuoteIndicatorQueryHandler.name);
  constructor(
    @Inject('LoadQuoteIndicatorPort')
    private readonly loadQuoteIndicatorPort: LoadQuoteIndicatorPort,
    @Inject('LoadCachedQuoteIndicatorPort')
    private readonly loadCachedQuoteIndicatorPort: LoadCachedQuoteIndicatorPort,
    @Inject('CachingQuoteIndicatorPort')
    private readonly cachingQuoteIndicatorPort: CachingQuoteIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  async execute(query: GetQuoteIndicatorQuery): Promise<IndicatorQuoteData> {
    //query에 있는 symbol 값은 일단 사용하지 않음
    const { indicatorId, indicatorType, volume_time_period, mic_code, eod, interval, timezone } = query;
    const indicatorDto: IndicatorDtoType = await this.loadIndicatorPort.loadIndicator(indicatorId, indicatorType);
    const nowDate = new Date();

    let quoteIndicatorDto: IndicatorQuoteData = await this.loadCachedQuoteIndicatorPort.loadCachedQuoteIndicator(
      indicatorDto,
      interval,
      nowDate,
      timezone,
    );

    if (this.isNotCached(quoteIndicatorDto)) {
      quoteIndicatorDto = await this.loadAndCacheQuoteIndicator(
        indicatorDto,
        volume_time_period,
        mic_code,
        eod,
        interval,
        timezone,
      );
      this.logger.log('Quote indicator(TWELVE) 호출');
    }

    return quoteIndicatorDto;
  }

  private async loadAndCacheQuoteIndicator(
    indicatorDto: IndicatorDtoType,
    volume_time_period: string,
    mic_code: string,
    eod: boolean,
    interval: QuoteIndicatorIntervalEnum,
    timezone: string,
  ): Promise<IndicatorQuoteData> {
    const qouteIndicatorDto: IndicatorQuoteData = await this.loadQuoteIndicatorPort.loadQuoteIndicator(
      indicatorDto,
      volume_time_period,
      mic_code,
      eod,
      interval,
      timezone,
    );
    await this.cachingQuoteIndicatorPort.cachingQuoteIndicator(qouteIndicatorDto, indicatorDto, interval, timezone);
    return qouteIndicatorDto;
  }

  private isNotCached(quoteIndicatorDto: IndicatorQuoteData) {
    return quoteIndicatorDto == null;
  }
}
