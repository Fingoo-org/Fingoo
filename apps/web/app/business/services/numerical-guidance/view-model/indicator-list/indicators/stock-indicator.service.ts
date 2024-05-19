import { Indicator } from './indicator.service';

import {
  StocksIndicatorResponse,
} from '@/app/store/querys/numerical-guidance/indicator-list.query';

export class StockIndicator extends Indicator {
  readonly symbol: string;
  readonly name: string;
  readonly country: string;
  readonly currency: string;
  readonly exchange: string;
  readonly mic_code: string;
  readonly type: string;

  constructor({
    id,
    indicatorType,
    symbol,
    name,
    country,
    currency,
    exchange,
    mic_code,
    type,
  }: StocksIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.name = name;
    this.country = country;
    this.currency = currency;
    this.exchange = exchange;
    this.mic_code = mic_code;
    this.type = type;
  }

  get formattedIndicator(): StocksIndicatorResponse {
    return {
      id: this.id,
      indicatorType: 'stocks',
      symbol: this.symbol,
      name: this.name,
      country: this.country,
      currency: this.currency,
      exchange: this.exchange,
      mic_code: this.mic_code,
      type: this.type,
    };
  }
}
