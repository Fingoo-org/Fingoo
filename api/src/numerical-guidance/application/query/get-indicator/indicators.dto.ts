import { Indicator } from './indicator.dto';

export class IndicatorsDto {
  indicators: Indicator[];

  private constructor(indicators: Indicator[]) {
    this.indicators = indicators;
  }

  static create(indicators: Indicator[]): IndicatorsDto {
    const resultIndicators: Indicator[] = indicators.map((indicator) => ({
      id: indicator.id,
      market: indicator.market,
      name: indicator.name,
      ticker: indicator.ticker,
      type: indicator.type,
    }));
    return new IndicatorsDto(resultIndicators);
  }
}
