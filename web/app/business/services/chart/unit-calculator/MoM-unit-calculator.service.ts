import { UnitCalculator, ValueItem } from './unit-calculator.service';
import dayjs from 'dayjs';

export class MoMUnitCalulator extends UnitCalculator {
  private _cachedValue: { [date: string]: number } = {};

  caculate() {
    const result = this._valueItems.map((item) => {
      return {
        date: item.date,
        value: this.caculateItemValue(item),
        displayValue: this.parseValueToInt(item.value),
      };
    });
    this._cachedValue = {};
    return result;
  }

  caculateItemValue(item: ValueItem) {
    const targetDate = dayjs(item.date);
    const targetValue = this.parseValueToInt(item.value);

    this._cachedValue[targetDate.format('YYYY-MM-DD')] = targetValue;

    const previousValue = this.getPreviousValue(targetDate);
    if (previousValue) {
      return this.caculateMoM(targetValue, previousValue);
    } else {
      return 0;
    }
  }

  caculateMoM(targetValue: number, previousValue: number) {
    return this.parseValueFixed(((targetValue - previousValue) / previousValue) * 100, 2);
  }

  parseValueFixed(value: number, fractionDigits: number) {
    return parseFloat(value.toFixed(fractionDigits));
  }

  getPreviousValue(date: dayjs.Dayjs) {
    const standardDate = date.subtract(1, 'month');

    const previoutDate = this.getPreviousDate(standardDate);

    return previoutDate ? this._cachedValue[previoutDate] : undefined;
  }

  getPreviousDate(targetDate: dayjs.Dayjs) {
    for (let i = 0; i < 7; i++) {
      const date = targetDate.subtract(i, 'day').format('YYYY-MM-DD');
      if (this._cachedValue[date]) {
        return date;
      }
    }
    return;
  }
}
