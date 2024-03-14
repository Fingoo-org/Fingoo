export type Market = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';

export type Interval = 'day' | 'week' | 'month' | 'year';

export type IndicatorType = 'k-stock' | 'exchange' | 'customForecastIndicator';

export type SourceIndicatorIdAndWeightType = {
  sourceIndicatorId: string;
  weight: float;
};

export type CustomerFroecastIndicatorValues = {
  name: string;
  values: Values[];
};

export type Values = {
  value: float;
  date: string;
};
