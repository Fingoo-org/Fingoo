import { IndicatorQuoteData } from '../../query/quote-indicator/get-quote-indicator/interface/quote-indicator-data.interface';
import { IndicatorDtoType } from '../../../../utils/type/type-definition';
import { QuoteIndicatorIntervalEnum } from '../../../../utils/enum/enum-definition';

export interface CachingQuoteIndicatorPort {
  cachingQuoteIndicator(
    quoteIndicatorDto: IndicatorQuoteData,
    indicatorDto: IndicatorDtoType,
    interval: QuoteIndicatorIntervalEnum,
    timezone: string,
  ): Promise<IndicatorQuoteData>;
}
