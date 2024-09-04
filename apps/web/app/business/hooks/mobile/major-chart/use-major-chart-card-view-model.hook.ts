import { useFetchMajorChart } from '@/app/store/querys/mobile/major-chart.query';
import { useMemo } from 'react';

export const useCountryMajorChartCard = () => {
  const { data: majorChartDataList, isValidating, mutate: revalidateMajorChartData } = useFetchMajorChart();

  const formattedMajorCharts = useMemo(() => {
    if (!majorChartDataList) return undefined;

    return majorChartDataList.map((majorChartData) => ({
      country: majorChartData.country,
      symbolName: majorChartData.symbolName,
      symbolPrice: majorChartData.symbolPrice,
      symbolChanges: majorChartData.symbolChanges,
      timeline: majorChartData.timeLine.map((price) => parseFloat(price)),
    }));
  }, [majorChartDataList]);

  return {
    majorCharts: formattedMajorCharts,
    isPending: isValidating,
    revalidateMajorChartData,
  };
};
