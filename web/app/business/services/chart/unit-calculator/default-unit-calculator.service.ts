import { UnitCalculator, ValueItem } from './unit-calculator.service';

export class DefaultUnitCalculator extends UnitCalculator {
  caculateItem(item: ValueItem) {
    return this.parseValueToInt(item.value);
  }
}
