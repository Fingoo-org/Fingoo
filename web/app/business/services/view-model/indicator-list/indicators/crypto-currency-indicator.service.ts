import { CryptocurrenciesIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { Indicator } from '../indicator-view-model.service';

export class CryptoCurrencyIndicator extends Indicator {
  readonly symbol: String;
  readonly currency_base: String;
  readonly currency_quote: String;

  constructor({ id, indicatorType, symbol, currency_base, currency_quote }: CryptocurrenciesIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.currency_base = currency_base;
    this.currency_quote = currency_quote;
  }

  get name(): String {
    return `${this.currency_base}/${this.currency_quote}`;
  }

  get exchange(): String {
    return this.currency_base;
  }
}
