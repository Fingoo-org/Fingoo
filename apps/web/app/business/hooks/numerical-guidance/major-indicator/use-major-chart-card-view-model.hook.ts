import {
  MajorIndicatorResponse,
  useFetchMajorIndicatorWithCountry,
} from '@/app/store/querys/numerical-guidance/major-indicator.query';
import { useMemo } from 'react';

export const useChunkArray = (array: MajorIndicatorResponse[] | undefined, size: number) => {
  const chunkedArray = useMemo(() => {
    if (!array) return [];

    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      const chunk = array.slice(i, i + size);
      chunks.push(chunk);
    }
    return chunks;
  }, [array, size]);

  return chunkedArray;
};

export const useCountryMajorIndicatorCardWithCountry = (country: string) => {
  const {
    data: majorChartDataList,
    isValidating,
    mutate: revalidateMajorChartData,
  } = useFetchMajorIndicatorWithCountry(country);

  const formattedMajorCharts = useMemo(() => {
    if (!majorChartDataList) return undefined;

    return majorChartDataList.map((majorChartData) => ({
      country: majorChartData.country,
      symbolName: majorChartData.symbolName,
      symbolPrice: majorChartData.symbolPrice,
      symbolChanges: majorChartData.symbolChanges,
      timeline: majorChartData.timeline.map(({ time, value }) => ({
        time,
        value,
      })),
    }));
  }, [majorChartDataList]);

  const chunkedMajorCharts = useChunkArray(formattedMajorCharts, 4);

  return {
    majorChartsWithCountry: chunkedMajorCharts,
    isPending: isValidating,
    revalidateMajorChartData,
  };
};
