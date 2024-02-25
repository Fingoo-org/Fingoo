import { IndicatorType, Market } from '../../../../utils/type/type-definition';

export type Indicator = {
  id: string;
  name: string;
  ticker: string;
  type: IndicatorType;
  market: Market;
};

export class IndicatorDto {
  indicator: Indicator;

  private constructor(indicator: Indicator) {
    this.indicator = indicator;
  }

  static create(indicator: Indicator): IndicatorDto {
    return new IndicatorDto(indicator);
  }
}
