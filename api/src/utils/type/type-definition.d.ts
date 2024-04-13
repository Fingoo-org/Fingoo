export type Market = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';

export type Interval = 'day' | 'week' | 'month' | 'year';

export type IndicatorType = 'k-stock' | 'exchange' | 'customForecastIndicator';

export type ForecastType = 'single' | 'multi';

export type SourceIndicatorIdAndWeightType = {
  sourceIndicatorId: string;
  weight: float;
};

export type IndicatorValue = {
  date: string;
  value: string;
};

export type ForecastApiResponse = {
  indicatorValues: IndicatorValue[];
  forecastType: ForecastType;
};

export type CustomForecastIndicatorValuesResponse = {
  customForecastIndicatorId: string;
  targetIndicatorId: string;
  type: IndicatorType;
  ticker: string;
  name: string;
  market: string;
  forecastType: ForecastType;
  customForecastIndicatorValues: IndicatorValue[];
  targetIndicatorValues: IndicatorValue[];
};
