import { Market } from 'src/type/market';

export class IndicatorListDto {
  indicatorList: Indicator[];

  private constructor(indicatorList: Indicator[]) {
    this.indicatorList = indicatorList;
  }

  static create(indicatorList: Indicator[]): IndicatorListDto {
    return new IndicatorListDto(indicatorList);
  }
}

export type Indicator = {
  id: number;
  name: string;
  ticker: string;
  type: string;
  market: Market;
};
