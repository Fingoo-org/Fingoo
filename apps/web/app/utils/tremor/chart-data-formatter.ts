import {
  chartValueFormatterFactory,
  FormattedRowType,
} from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';

export function formatChartData(data: FormattedRowType[], categories: string[]) {
  const calculateChartValue = chartValueFormatterFactory(categories);
  return data.map((d) => {
    return {
      ...Object.keys(d).reduce((acc, key) => {
        if (key === 'date') {
          return { ...acc, [key]: d[key] };
        }
        return {
          ...acc,
          [key]: calculateChartValue(
            d[key] as {
              value: number;
              displayValue: number;
            },
          ),
        };
      }, {}),
      displayValue: Object.keys(d).reduce((acc, key) => {
        if (key === 'date') {
          return { ...acc, [key]: d[key] };
        }
        return {
          ...acc,
          [key]: (
            d[key] as {
              value: number;
              displayValue: number;
            }
          ).displayValue,
        };
      }, {}),
    };
  });
}
