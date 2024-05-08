import { CryptocurrenciesIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { Indicator } from './indicator.service';

export class CryptocurrencyIndicator extends Indicator {
  readonly symbol: string;
  readonly currency_base: string;
  readonly currency_quote: string;

  constructor({ id, indicatorType, symbol, currency_base, currency_quote }: CryptocurrenciesIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.currency_base = currency_base;
    this.currency_quote = currency_quote;
  }

  get name(): string {
    return `${this.currency_base}/${this.currency_quote}`;
  }

  get exchange(): string {
    return this.currency_base;
  }
}
