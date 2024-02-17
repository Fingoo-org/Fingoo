import { IndicatorType, Market } from 'src/utils/type/type-definition';

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
  type: IndicatorType;
  market: Market;
};
