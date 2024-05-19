import { IndicesIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { Indicator } from './indicator.service';

export class IndexIndicator extends Indicator {
  readonly symbol: string;
  readonly name: string;
  readonly country: string;
  readonly currency: string;
  readonly exchange: string;
  readonly mic_code: string;

  constructor({ id, indicatorType, symbol, name, country, currency, exchange, mic_code }: IndicesIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.name = name;
    this.country = country;
    this.currency = currency;
    this.exchange = exchange;
    this.mic_code = mic_code;
  }

  get formattedIndicator(): IndicesIndicatorResponse {
    return {
      id: this.id,
      indicatorType: 'indices',
      symbol: this.symbol,
      name: this.name,
      country: this.country,
      currency: this.currency,
      exchange: this.exchange,
      mic_code: this.mic_code,
    };
  }
}
