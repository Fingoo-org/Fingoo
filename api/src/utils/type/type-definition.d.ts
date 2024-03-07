export type Market = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';

export type Interval = 'day' | 'week' | 'month' | 'year';

export type IndicatorType = 'k-stock' | 'exchange' | 'customForecastIndicator';

export type SourceIndicatorIdAndWeightType = {
  sourceIndicatorId: string;
  weight: float;
};
