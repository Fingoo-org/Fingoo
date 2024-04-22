import type { IndicatorValueItem } from '../../view-model/indicator-value/indicator-value-view-model.service';

export class IndexUnitCalculator {
  private _indicatorValueItems: IndicatorValueItem[];
  private _max: number;
  private _min: number;
  constructor(indicatorValueItems: IndicatorValueItem[]) {
    this._indicatorValueItems = indicatorValueItems;
    this._max = this.max;
    this._min = this.min;
  }

  get max() {
    return Math.max(...this._indicatorValueItems.map((item) => item.parseValueToInt));
  }

  get min() {
    return Math.min(...this._indicatorValueItems.map((item) => item.parseValueToInt));
  }

  caculate() {
    return this._indicatorValueItems.map((item) => {
      return {
        date: item.date,
        value: this.caculateItem(item),
        displayValue: item.parseValueToInt,
      };
    });
  }

  caculateItem(item: IndicatorValueItem) {
    return ((item.parseValueToInt - this._min) / (this._max - this._min)) * 100;
  }
}
