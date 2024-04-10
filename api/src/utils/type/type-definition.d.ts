export type Market = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';

export type Interval = 'day' | 'week' | 'month' | 'year';

export type IndicatorType = 'k-stock' | 'exchange' | 'customForecastIndicator';

export type singleOrMulti = 'single' | 'multi';

export type SourceIndicatorIdAndWeightType = {
  sourceIndicatorId: string;
  weight: float;
};

export type IndicatorValue = {
  date: string;
  value: string;
};

export type forecastApiResponse = {
  IndicatorValues: IndicatorValue[];
  singleOrMulti: singleOrMulti;
};

export type CustomForecastIndicatorValuesResponse = {
  customForecastIndicatorId: string;
  targetIndicatorId: string;
  type: IndicatorType;
  ticker: string;
  name: string;
  market: string;
  singleOrMulti: singleOrMulti;
  customForecastIndicatorValues: IndicatorValue[];
  targetIndicatorValues: IndicatorValue[];
};
