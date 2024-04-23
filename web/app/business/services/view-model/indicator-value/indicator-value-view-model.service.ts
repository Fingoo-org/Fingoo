import { IndicatorValueItemResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import { FormattedIndicatorValue } from '../../chart/indicator-formatter.service';

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

export type UnitType = 'index' | 'default';

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

  constructor(id: string) {
    this.id = id;
  }

  abstract caculateItemsValue({ unitType }: { unitType: UnitType }): CaculatedItem[];

  abstract formatItemsByDate({ unitType }: { unitType: UnitType }): FormattedItem;

  abstract get identifier(): string;
}
