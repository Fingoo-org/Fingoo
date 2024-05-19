import { CryptocurrenciesIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { Indicator } from './indicator.service';

export class CryptocurrencyIndicator extends Indicator {
  readonly symbol: string;
  readonly currency_base: string;
  readonly currency_quote: string;
  readonly available_exchanges: string[];

  constructor({ id, indicatorType, symbol, currency_base, currency_quote, available_exchanges }: CryptocurrenciesIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.currency_base = currency_base;
    this.currency_quote = currency_quote;
    this.available_exchanges = available_exchanges;

  }

  get name(): string {
    return `${this.currency_base}/${this.currency_quote}`;
  }

  get exchange(): string {
    return this.currency_base;
  }

  get formattedIndicator(): CryptocurrenciesIndicatorResponse {
    return {
      id: this.id,
      indicatorType: 'cryptocurrencies',
      symbol: this.symbol,
      currency_base: this.currency_base,
      currency_quote: this.currency_quote,
      available_exchanges: this.available_exchanges,
    };
  }
}
