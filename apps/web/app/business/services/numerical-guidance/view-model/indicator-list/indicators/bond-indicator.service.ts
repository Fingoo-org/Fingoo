import { BondsIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { Indicator } from './indicator.service';

export class BondIndicator extends Indicator {
  readonly symbol: string;
  readonly name: string;
  readonly country: string;
  readonly currency: string;
  readonly exchange: string;
  readonly type: string;

  constructor({ id, indicatorType, symbol, name, country, currency, exchange, type }: BondsIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.name = name;
    this.country = country;
    this.currency = currency;
    this.exchange = exchange;
    this.type = type;
  }

  get formattedIndicator(): BondsIndicatorResponse {
    return {
      id: this.id,
      indicatorType: 'bonds',
      symbol: this.symbol,
      name: this.name,
      country: this.country,
      currency: this.currency,
      exchange: this.exchange,
      type: this.type,
    };
  }
}
