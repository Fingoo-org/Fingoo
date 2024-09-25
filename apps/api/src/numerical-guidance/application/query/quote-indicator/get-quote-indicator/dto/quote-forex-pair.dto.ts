import { BaseQuoteIndicatorDto } from './base-quote-indicator.dto';
import { QuoteIndicatorFiftyTwoWeekDto } from './quote-indicator.fify-two-week.dto';

export class QuoteForexPairDto extends BaseQuoteIndicatorDto {
  static create(data: QuoteForexPairDto): QuoteForexPairDto {
    const quoteForexPairDto: QuoteForexPairDto = Object.assign(new QuoteForexPairDto(), data);
    quoteForexPairDto.fifty_two_week = new QuoteIndicatorFiftyTwoWeekDto(data.fifty_two_week);
    return quoteForexPairDto;
  }
}
