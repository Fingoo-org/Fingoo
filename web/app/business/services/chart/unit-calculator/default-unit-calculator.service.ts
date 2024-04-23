type ValueItem = {
  date: string;
  value: number | string;
};

export class DefaultUnitCalculator {
  private _valueItems: ValueItem[];
  constructor(valueItems: ValueItem[]) {
    this._valueItems = valueItems;
  }

  caculate() {
    return this._valueItems.map((item) => {
      return {
        date: item.date,
        value: this.parseValueToInt(item.value),
        displayValue: this.parseValueToInt(item.value),
      };
    });
  }

  parseValueToInt(value: number | string) {
    return typeof value === 'number' ? value : parseInt(value);
  }
}
