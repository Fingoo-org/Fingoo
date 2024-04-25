import { UnitCalculator, ValueItem } from './unit-calculator.service';
import { formatDate, parseDate } from '@/app/utils/date-formatter';

export class MoMUnitCalulator extends UnitCalculator {
  private _cachedValue: { [date: string]: number } = {};

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

  cacheValue() {
    this._valueItems.forEach((item) => {
      this._cachedValue[formatDate(item.date)] = this.parseValueToInt(item.value);
    });
  }

  caculateItemValue(item: ValueItem) {
    const targetValue = this.parseValueToInt(item.value);
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
    const standardDate = parseDate(targetDate).subtract(1, 'month');

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
