import { IndicatorType, Market } from 'src/utils/type/type-definition';

export type Item = {
  date: string;
  value: string;
};

export class FluctuatingIndicatorDto {
  type: IndicatorType;
  ticker: string;
  name: string;
  market: Market;
  totalCount: number;
  items: Item[];

  private constructor(
    type: IndicatorType,
    ticker: string,
    name: string,
    market: Market,
    totalCount: number,
    items: Item[],
  ) {
    this.type = type;
    this.ticker = ticker;
    this.name = name;
    this.market = market;
    this.totalCount = totalCount;
    this.items = items;
  }

  static create({ type, ticker, name, market, totalCount, items }): FluctuatingIndicatorDto {
    return new FluctuatingIndicatorDto(type, ticker, name, market, totalCount, items);
  }
}
export { IndicatorType };
