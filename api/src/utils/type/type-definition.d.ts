export type Market = 'KOSPI' | 'KOSDAQ' | 'NASDAQ' | 'NYSE';

export type Interval = 'day' | 'week' | 'month' | 'year';

export type IndicatorType = 'k-stock' | 'exchange' | 'customForecastIndicator';

export type SourceIndicatorIdAndWeightType = {
  sourceIndicatorId: string;
  weight: float;
};

export type CustomForecastIndicatorValues = {
  name: string;
  values: IndicatorValue[];
};

export type IndicatorValue = {
  date: string;
  value: string;
};

export type TargetIndicatorsValues = {
  name: string;
  values: IndicatorValue[];
};

export type CustomForecastIndicatorValuesResponse = {
  customForecastIndicatorValues: CustomForecastIndicatorValues;
  targetIndicatorValues: TargetIndicatorsValues;
};
