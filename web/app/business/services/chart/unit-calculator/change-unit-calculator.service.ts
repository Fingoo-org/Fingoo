import { UnitCalculator, ValueItem } from './unit-calculator.service';
import { formatDate } from '@/app/utils/date-formatter';

export abstract class ChangeUnitCalculator extends UnitCalculator {
  protected _cachedValue: { [date: string]: number } = {};

  caculate() {
    this.cacheValue();
    const result = this._valueItems.map((item) => {
      return {
        date: item.date,
        value: this.caculateItemValue(item),
      };
    });
    return result;
  }

  caculateChange(targetValue: number, previousValue: number) {
    return this.parseValueFixed(((targetValue - previousValue) / previousValue) * 100, 2);
  }

  parseValueFixed(value: number, fractionDigits: number) {
    return parseFloat(value.toFixed(fractionDigits));
  }

  cacheValue() {
    this._valueItems.forEach((item) => {
      this._cachedValue[formatDate(item.date)] = this.parseValueToInt(item.value);
    });
  }

  caculateItemValue(item: ValueItem) {
    const targetValue = this.parseValueToInt(item.value);
    const previousValue = this.getPreviousValue(item.date);
    if (previousValue) {
      return this.caculateChange(targetValue, previousValue);
    } else {
      return 0;
    }
  }

  getPreviousValue(targetDate: string) {
    const previoutDate = this.getPreviousDate(targetDate);
    return previoutDate ? this._cachedValue[previoutDate] : undefined;
  }

  abstract getPreviousDate(targetDate: string): string | undefined;
}
