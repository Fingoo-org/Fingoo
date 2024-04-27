import { EtfIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { Indicator } from '../indicator-view-model.service';

export class EtfIndicator extends Indicator {
  readonly symbol: String;
  readonly name: String;
  readonly country: String;
  readonly currency: String;
  readonly exchange: String;

  constructor({ id, indicatorType, symbol, name, country, currency, exchange }: EtfIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.name = name;
    this.country = country;
    this.currency = currency;
    this.exchange = exchange;
  }
}
