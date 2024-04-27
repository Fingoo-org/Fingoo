import { Indicator } from './indicator.service';

import { ForexPairsIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';

export class ForexPairIndicator extends Indicator {
  readonly symbol: String;
  readonly currency_group: String;
  readonly currency_base: String;
  readonly currency_quote: String;

  constructor({
    id,
    indicatorType,
    symbol,
    currency_group,
    currency_base,
    currency_quote,
  }: ForexPairsIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.currency_group = currency_group;
    this.currency_base = currency_base;
    this.currency_quote = currency_quote;
  }

  get name(): String {
    return `${this.currency_base}/${this.currency_quote}`;
  }

  get exchange(): String {
    return this.currency_group;
  }
}
