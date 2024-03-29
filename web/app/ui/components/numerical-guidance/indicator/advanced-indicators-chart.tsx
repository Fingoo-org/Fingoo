import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-history-indicators-value-view-model.hook';
import AdvancedMultiLineChart from '../../view/molocule/advanced-multi-line-chart/advanced-multi-line-chart';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import { useEffect } from 'react';
import { createIndicatorFormatter } from '@/app/business/services/chart/indicator-formatter.service';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';

export default function AdvancedIndicatorsChart() {
  const {
    actualHistoryIndicatorsValue,
    customForecastHistoryIndicatorsValue,
    setPaginationData,
    setInitialCursorDate,
  } = useHistoryIndicatorsValueViewModel();
  const { indicatorsValue } = useLiveIndicatorsValueViewModel();
  const { customForecastIndicatorsValue } = useCustomForecastIndicatorsValueViewModel();

  const indicatorFormatter = createIndicatorFormatter(
    indicatorsValue?.indicatorsValue ?? [],
    customForecastIndicatorsValue ?? [],
  );
  const historyIndicatorFormatter = createIndicatorFormatter(
    actualHistoryIndicatorsValue?.indicatorsValue ?? [],
    customForecastHistoryIndicatorsValue ?? [],
  );

  const formattedLiveIndicatorsRows = indicatorFormatter.formattedIndicatorsInRow;
  const formattedHistoryIndicatorsRows = historyIndicatorFormatter.formattedIndicatorsInRow;

  const startDate = formattedLiveIndicatorsRows[0]?.date as string;

  const formattedAdvencedIndicatorsRows = [
    ...(formattedHistoryIndicatorsRows || []),
    ...(formattedLiveIndicatorsRows || []),
  ];

  const initialLength = formattedLiveIndicatorsRows?.length || 0;
  const initialIndex = initialLength - (formattedAdvencedIndicatorsRows?.length || 0);

  useEffect(() => {
    if (startDate) {
      setInitialCursorDate(new Date(startDate));
    }
  }, [startDate]);

  const handleLoadData = (rowsToDownload: number, initialIndex: number) => {
    setPaginationData({
      rowsToDownload,
    });
  };

  return (
    <AdvancedMultiLineChart
      displayRowsSize={initialLength}
      initialIndex={initialIndex}
      onLoadData={handleLoadData}
      data={formattedAdvencedIndicatorsRows || []}
    />
  );
}
