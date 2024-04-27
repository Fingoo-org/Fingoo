import { Indicator } from './indicator.service';

import { ForexPairsIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';

export class ForexPairIndicator extends Indicator {
  readonly symbol: string;
  readonly currency_group: string;
  readonly currency_base: string;
  readonly currency_quote: string;

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

  get name(): string {
    return `${this.currency_base}/${this.currency_quote}`;
  }

  get exchange(): string {
    return this.currency_group;
  }
}
