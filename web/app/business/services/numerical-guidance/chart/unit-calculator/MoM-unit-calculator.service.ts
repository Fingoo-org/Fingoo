import { parseDate } from '@/app/utils/date-formatter';
import { ChangeUnitCalculator } from './change-unit-calculator.service';

export class MoMUnitCalulator extends ChangeUnitCalculator {
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
}
