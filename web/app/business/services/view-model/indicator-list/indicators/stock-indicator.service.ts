import { Indicator } from '../indicator-view-model.service';

import { StocksIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';

export class StockIndicator extends Indicator {
  readonly symbol: String;
  readonly name: String;
  readonly country: String;
  readonly currency: String;
  readonly exchange: String;
  readonly mic_code: String;
  readonly type: String;

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
}
