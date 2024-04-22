import type { IndicatorValueItem } from '../../view-model/indicator-value/indicator-value-view-model.service';

export class DefaultUnitCalculator {
  private _indicatorValueItems: IndicatorValueItem[];
  constructor(indicatorValueItems: IndicatorValueItem[]) {
    this._indicatorValueItems = indicatorValueItems;
  }

  caculate() {
    return this._indicatorValueItems.map((item) => {
      return {
        date: item.date,
        value: item.parseValueToInt,
        displayValue: item.parseValueToInt,
      };
    });
  }
}
