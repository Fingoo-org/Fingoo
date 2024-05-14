import { Injectable } from '@nestjs/common';
import { IndicatorValueManager } from './indicator-value-manager';
import { IndicatorValue } from '../../utils/type/type-definition';

const DATA_DECIMAL_POINT = 6;
const INIT_DATA = 0;
const DATE_SLICING_START_INDEX = 0;
const DATE_SLICING_END_INDEX = 4;

@Injectable()
export class AdjustIndicatorValue extends IndicatorValueManager<IndicatorValue> {
  public calculateValues(rowIndicatorValues: IndicatorValue[]): IndicatorValue[] {
    const yearMap: Map<string, { totalValue: number; count: number }> = new Map();

    for (const indicatorValue of rowIndicatorValues) {
      const year = indicatorValue.date.slice(DATE_SLICING_START_INDEX, DATE_SLICING_END_INDEX);
      const value = parseFloat(indicatorValue.value);
      const yearData = yearMap.get(year) || { totalValue: INIT_DATA, count: INIT_DATA };
      yearData.totalValue += value;
      yearData.count++;
      yearMap.set(year, yearData);
    }

    return Array.from(yearMap, ([year, { totalValue, count }]) => ({
      date: `${year}-01-01`,
      value: (totalValue / count).toFixed(DATA_DECIMAL_POINT),
    }));
  }

  public getCurrentDateString(value: IndicatorValue): string {
    return value.date;
  }
}
