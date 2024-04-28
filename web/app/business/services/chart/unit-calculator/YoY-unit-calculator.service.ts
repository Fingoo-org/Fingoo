import { ChangeUnitCalculator } from './change-unit-calculator.service';
import { formatDate, parseDate } from '@/app/utils/date-formatter';

export class YoYUnitCalulator extends ChangeUnitCalculator {
  getPreviousDate(targetDate: string) {
    const standardDate = parseDate(targetDate).subtract(1, 'year');

    for (let i = 0; i < 7; i++) {
      const date = standardDate.subtract(i, 'day').format('YYYY-MM-DD');
      if (this._cachedValue[date]) {
        return date;
      }
    }
    return;
  }
}
