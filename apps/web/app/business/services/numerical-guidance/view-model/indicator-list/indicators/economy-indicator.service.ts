import { Indicator } from './indicator.service';

import { EconomyIndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';

export class EconomyIndicator extends Indicator {
  readonly symbol: string;
  readonly name: string;
  readonly frequency: string;
  readonly frequency_short: string;
  readonly units: string;
  readonly units_short: string;
  readonly seasonal_adjustment: string;
  readonly seasonal_adjustment_short: string;
  readonly notes: string;

  constructor({
    id,
    indicatorType,
    symbol,
    name,
    frequency,
    frequency_short,
    units,
    units_short,
    seasonal_adjustment,
    seasonal_adjustment_short,
    notes,
  }: EconomyIndicatorResponse) {
    super(id, indicatorType);
    this.symbol = symbol;
    this.name = name;
    this.frequency = frequency;
    this.frequency_short = frequency_short;
    this.units = units;
    this.units_short = units_short;
    this.seasonal_adjustment = seasonal_adjustment;
    this.seasonal_adjustment_short = seasonal_adjustment_short;
    this.notes = notes;
  }

  get exchange(): string {
    return 'FRED';
  }

  get formattedIndicator(): EconomyIndicatorResponse {
    return {
      id: this.id,
      indicatorType: 'economy',
      symbol: this.symbol,
      name: this.name,
      frequency: this.frequency,
      frequency_short: this.frequency_short,
      units: this.units,
      units_short: this.units_short,
      seasonal_adjustment: this.seasonal_adjustment,
      seasonal_adjustment_short: this.seasonal_adjustment_short,
      notes: this.notes,
    };
  }
}
