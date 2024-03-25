import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-history-indicators-value-view-model.hook';
import AdvancedMultiLineChart from '../../view/molocule/advanced-multi-line-chart/advanced-multi-line-chart';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import { useEffect } from 'react';
import { IndicatorFormatter } from '@/app/business/services/chart/indicator-formatter.service';

export default function AdvancedIndicatorsChart() {
  const { historyIndicatorsValue, setPaginationData, setInitialCursorDate } = useHistoryIndicatorsValueViewModel();
  const { indicatorsValue } = useLiveIndicatorsValueViewModel();

  const indicatorFormatter = new IndicatorFormatter(indicatorsValue?.indicatorsValue ?? []);
  const historyIndicatorFormatter = new IndicatorFormatter(historyIndicatorsValue?.indicatorsValue ?? []);

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
