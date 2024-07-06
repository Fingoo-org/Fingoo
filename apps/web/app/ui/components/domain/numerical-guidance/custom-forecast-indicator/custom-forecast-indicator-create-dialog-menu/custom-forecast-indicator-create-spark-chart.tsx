import { useCreatingCustomForecastIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-creating-custom-forecast-indicator.hook';
import { useSparkIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-spark-indicators-value-view-model.hook';
import { createIndicatorFormatter } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import SparkChart from '@/app/ui/components/view/molecule/spark-chart/spark-chart';

export default function CustomForecastIndicatorCreateSparkChart() {
  const { targetIndicator, sourceIndicators } = useCreatingCustomForecastIndicator();

  const { indicatorsValue: targetIndicatorValue } = useSparkIndicatorsValueViewModel({
    indicators: targetIndicator ? [targetIndicator] : [],
  });

  const { indicatorsValue: sourceIndicatorsValue } = useSparkIndicatorsValueViewModel({
    indicators: sourceIndicators.map((s) => ({
      ...s,
      id: s.sourceIndicatorId,
    })),
  });

  const indicatorFormatter = createIndicatorFormatter(
    targetIndicatorValue?.indicatorsValue ?? [],
    sourceIndicatorsValue?.indicatorsValue ?? [],
  );

  const areaChartCategories = targetIndicator ? [targetIndicator.symbol] : [];
  const lineChartCategories = indicatorFormatter.columns.filter((column) => column !== targetIndicator?.symbol);

  return (
    <SparkChart
      className="h-36 w-full"
      index="date"
      data={indicatorFormatter.formattedIndicatorsInRow}
      areaChartCategories={areaChartCategories}
      lineChartCategories={lineChartCategories}
    />
  );
}
