import { useCreatingCustomForecastIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-creating-custom-forecast-indicator.hook';
import { useSparkIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-spark-indicators-value-view-model.hook';
import { createIndicatorFormatter } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import SparkChart from '@/app/ui/components/view/molecule/spark-chart/spark-chart';
import { SPARK_INDICATOR_COLOR } from '@/app/utils/style/color';

export default function CustomForecastIndicatorCreateSparkChart() {
  const { targetIndicator, sourceIndicators } = useCreatingCustomForecastIndicator();

  const { indicatorsValue: targetIndicatorValue } = useSparkIndicatorsValueViewModel({
    indicators: targetIndicator ? [targetIndicator] : [],
  });

  const { indicatorsValue: sourceIndicatorsValue } = useSparkIndicatorsValueViewModel({
    indicators: sourceIndicators.map((s) => ({
      ...s,
      id: s.sourceIndicatorId,
      weight: s.weight,
    })),
  });

  const indicatorFormatter = createIndicatorFormatter(
    targetIndicatorValue?.indicatorsValue ?? [],
    sourceIndicatorsValue?.indicatorsValue ?? [],
  );

  console.log(indicatorFormatter.formattedIndicatorsInRow);

  const areaChartCategories = targetIndicator ? [targetIndicator.symbol] : [];
  const lineChartCategories = indicatorFormatter.columns.filter((column) => column !== targetIndicator?.symbol);

  return (
    <SparkChart
      colors={SPARK_INDICATOR_COLOR}
      className="h-40 w-full"
      index="date"
      data={indicatorFormatter.formattedIndicatorsInRow}
      areaChartCategories={areaChartCategories}
      lineChartCategories={lineChartCategories}
      autoReferenceArea={true}
    />
  );
}
