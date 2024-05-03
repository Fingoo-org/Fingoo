import { UnitCalculator, type ValueItem } from './unit-calculator.service';

export class IndexUnitCalculator extends UnitCalculator {
  private _max: number;
  private _min: number;
  constructor(valueItems: ValueItem[]) {
    super(valueItems);
    this._max = this.max;
    this._min = this.min;
  }

  get max() {
    return Math.max(...this._valueItems.map((item) => this.parseValueToInt(item.value)));
  }

  get min() {
    return Math.min(...this._valueItems.map((item) => this.parseValueToInt(item.value)));
  }

  caculateItem(item: ValueItem) {
    return this.parseValueFixed(((this.parseValueToInt(item.value) - this._min) / (this._max - this._min)) * 100, 2);
  }
}
