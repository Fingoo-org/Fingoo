import { BaseQuoteIndicatorDto } from './base-quote-indicator.dto';

export class QuoteForexPairDto extends BaseQuoteIndicatorDto {
  static create(data: QuoteForexPairDto): QuoteForexPairDto {
    return Object.assign(new QuoteForexPairDto(), data);
  }
}
