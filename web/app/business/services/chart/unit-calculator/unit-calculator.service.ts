export type ValueItem = {
  date: string;
  value: number | string;
};

type CaculatedValueItem = {
  date: string;
  value: number;
};

export abstract class UnitCalculator {
  protected _valueItems: ValueItem[];
  constructor(valueItems: ValueItem[]) {
    this._valueItems = valueItems;
  }

  abstract caculate(): CaculatedValueItem[];

  parseValueToInt(value: number | string) {
    return typeof value === 'number' ? value : parseInt(value);
  }
}
