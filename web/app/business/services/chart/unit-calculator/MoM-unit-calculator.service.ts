import { UnitCalculator, ValueItem } from './unit-calculator.service';
import dayjs from 'dayjs';

export class MoMUnitCalulator extends UnitCalculator {
  private _cachedValue: { [date: string]: number } = {};

  caculate() {
    const result = this._valueItems.map((item) => {
      return {
        date: item.date,
        value: this.caculateItemValue(item),
      };
    });
    this._cachedValue = {};
    return result;
  }

  caculateItemValue(item: ValueItem) {
    const targetValue = this.parseValueToInt(item.value);

    this._cachedValue[item.date] = targetValue;

    const previousValue = this.getPreviousValue(item.date);
    if (previousValue) {
      return this.caculateMoM(targetValue, previousValue);
    } else {
      return 0;
    }
  }

  getPreviousValue(targetDate: string) {
    const previoutDate = this.getPreviousDate(targetDate);

    return previoutDate ? this._cachedValue[previoutDate] : undefined;
  }

  getPreviousDate(targetDate: string) {
    const standardDate = dayjs(targetDate).subtract(1, 'month');

    for (let i = 0; i < 7; i++) {
      const date = standardDate.subtract(i, 'day').format('YYYY-MM-DD');
      if (this._cachedValue[date]) {
        return date;
      }
    }
    return;
  }

  caculateMoM(targetValue: number, previousValue: number) {
    return this.parseValueFixed(((targetValue - previousValue) / previousValue) * 100, 2);
  }

  parseValueFixed(value: number, fractionDigits: number) {
    return parseFloat(value.toFixed(fractionDigits));
  }
}
