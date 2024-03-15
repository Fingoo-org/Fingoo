import { Indicator } from '../get-indicator/indicator.dto';
import { IndicatorValue } from '../get-live-indicator/live-indicator.dto';

export type HistoryIndicatorValue = {
  date: Date;
  close: number;
  compare: number;
  fluctuation: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  tradingValue: number;
  marketCapitalization: number;
  outstandingShares: number;
};

export class HistoryIndicatorDto {
  indicator: Indicator;
  values: IndicatorValue[];

  private constructor(indicator: Indicator, values: IndicatorValue[]) {
    this.indicator = indicator;
    this.values = values;
  }

  static create(indicator: Indicator, values: IndicatorValue[]): HistoryIndicatorDto {
    return new HistoryIndicatorDto(indicator, values);
  }
}
