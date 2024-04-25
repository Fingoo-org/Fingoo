import { UnitCalculator } from './unit-calculator.service';

export class DefaultUnitCalculator extends UnitCalculator {
  caculate() {
    return this._valueItems.map((item) => {
      return {
        date: item.date,
        value: this.parseValueToInt(item.value),
      };
    });
  }
}
