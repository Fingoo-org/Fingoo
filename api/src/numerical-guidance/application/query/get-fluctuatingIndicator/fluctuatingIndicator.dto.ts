import { IndicatorType, Market } from 'src/utils/type/type-definition';

export type IndicatorValue = {
  date: string;
  value: string;
};

export class FluctuatingIndicatorDto {
  type: IndicatorType;
  ticker: string;
  name: string;
  market: Market;
  totalCount: number;
  values: IndicatorValue[];

  private constructor(
    type: IndicatorType,
    ticker: string,
    name: string,
    market: Market,
    totalCount: number,
    values: IndicatorValue[],
  ) {
    this.type = type;
    this.ticker = ticker;
    this.name = name;
    this.market = market;
    this.totalCount = totalCount;
    this.values = values;
  }

  static create({ type, ticker, name, market, totalCount, values }): FluctuatingIndicatorDto {
    return new FluctuatingIndicatorDto(type, ticker, name, market, totalCount, values);
  }
}
export { IndicatorType };
