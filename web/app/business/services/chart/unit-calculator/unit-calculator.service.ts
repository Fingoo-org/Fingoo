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

  caculate() {
    return this._valueItems.map((item) => {
      return {
        date: item.date,
        value: this.caculateItem(item),
      };
    });
  }

  abstract caculateItem(item: ValueItem): number;

  parseValueToInt(value: number | string) {
    return typeof value === 'number' ? value : parseInt(value);
  }

  parseValueToFloat(value: number | string) {
    return typeof value === 'number' ? value : parseFloat(value);
  }

  parseValueFixed(value: number | string, fractionDigits: number) {
    return this.parseValueToFloat(this.parseValueToFloat(value).toFixed(fractionDigits));
  }
}
