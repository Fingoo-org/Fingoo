import { IndicatorValueItemResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import { FormattedIndicatorValue } from '../../chart/indicator-formatter.service';
import { UnitType } from '../../chart/unit-calculator/unit-calculator-factory.service';

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

export class IndicatorValueItem {
  readonly date: string;
  readonly value: number | string;
  constructor({ date, value }: IndicatorValueItemResponse) {
    this.date = date;
    this.value = value;
  }
}

export abstract class IndicatorValue {
  public id: string;
  protected _unitType: UnitType = 'default';

  constructor(id: string) {
    this.id = id;
  }

  set unitType(unitType: UnitType) {
    this._unitType = unitType;
  }

  abstract caculateItemsValue(): CaculatedItem[];

  abstract formatItemsByDate(): FormattedItem;

  abstract get identifier(): string;
}
