import { IndicatorValueItemResponse } from '@/app/store/querys/numerical-guidance/indicator-value.query';
import { FormattedIndicatorValue } from '../../chart/indicator-formatter.service';
import { createUnitCalculator, UnitType } from '../../chart/unit-calculator/unit-calculator-factory.service';
import { getBigestDateInArray, getSmallestDateInArray } from '@/app/utils/date-formatter';

export type FormattedItem = {
  [date: string]: {
    [identiifer: string]: FormattedIndicatorValue;
  };
};

export type CaculatedItem = {
  date: string;
  value: number;
  displayValue: number;
};

export type FormatOptions = {
  isValueWithIndexUnit?: boolean;
};

export class IndicatorValueItem {
  readonly date: string;
  readonly value: number | string;
  constructor({ date, value }: IndicatorValueItemResponse) {
    this.date = date;
    this.value = value;
  }
}

export abstract class IndicatorValue {
  readonly id: string;
  protected _unitType: UnitType = 'default';
  readonly values: IndicatorValueItem[] = [];

  constructor(id: string, values: IndicatorValueItem[]) {
    this.id = id;
    this.values = values;
  }

  abstract formatItemsByDate(options?: FormatOptions): FormattedItem;

  abstract get identifier(): string;

  set unitType(unitType: UnitType) {
    this._unitType = unitType;
  }

  get lastDate() {
    return getBigestDateInArray([this.values[0].date, this.values[this.values.length - 1].date]);
  }

  get startDate() {
    return getSmallestDateInArray([this.values[0].date, this.values[this.values.length - 1].date]);
  }

  caculateItemsValue(isValueWithIndexUnit: boolean): CaculatedItem[] {
    const caculatedDisplayValues = createUnitCalculator(this.values, this._unitType).caculate();

    const caculatedValues = isValueWithIndexUnit
      ? createUnitCalculator(caculatedDisplayValues, 'index').caculate()
      : caculatedDisplayValues;

    return caculatedDisplayValues.map((item, index) => {
      const value = caculatedValues[index].value;
      return {
        date: item.date,
        value: value,
        displayValue: item.value,
      };
    });
  }
}
