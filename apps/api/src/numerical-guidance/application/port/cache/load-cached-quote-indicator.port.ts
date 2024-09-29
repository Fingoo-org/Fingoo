import { IndicatorQuoteData } from '../../query/quote-indicator/get-quote-indicator/interface/quote-indicator-data.interface';
import { IndicatorDtoType } from '../../../../utils/type/type-definition';
import { QuoteIndicatorIntervalEnum } from '../../../../utils/enum/enum-definition';

export interface LoadCachedQuoteIndicatorPort {
  loadCachedQuoteIndicator(
    indicatorDto: IndicatorDtoType,
    interval: QuoteIndicatorIntervalEnum,
    nowDate: Date,
    timezone: string,
  ): Promise<IndicatorQuoteData>;
}
