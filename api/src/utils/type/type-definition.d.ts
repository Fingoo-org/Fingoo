export type Market = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';

export type Interval = 'day' | 'week' | 'month' | 'year';

export type IndicatorType = 'k-stock' | 'exchange' | 'CustomForecastIndicator';

export type SourceIndicatorIdAndWeightType = {
  SourceIndicatorId: string;
  Weight: float;
};
