import { IndicatorQuoteData } from '../../../query/quote-indicator/get-quote-indicator/interface/quote-indicator-data.interface';
import { IndicatorDtoType } from '../../../../../utils/type/type-definition';
import { QuoteIndicatorIntervalEnum } from '../../../../../utils/enum/enum-definition';

export interface LoadQuoteIndicatorPort {
  loadQuoteIndicator(
    indicatorDto: IndicatorDtoType,
    volumn_time_period: string,
    mic_code: string,
    eod: boolean,
    interval: QuoteIndicatorIntervalEnum,
    timezone: string,
  ): Promise<IndicatorQuoteData>;
}
