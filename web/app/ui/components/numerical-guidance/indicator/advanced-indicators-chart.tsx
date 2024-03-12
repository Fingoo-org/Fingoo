import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-history-indicators-value-view-model.hook';
import AdvancedMultiLineChart from '../../view/molocule/advanced-multi-line-chart/advanced-multi-line-chart';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import { useEffect } from 'react';

export default function AdvancedIndicatorsChart() {
  const { formattedHistoryIndicatorsRows, setPaginationData, setInitialCursorDate } =
    useHistoryIndicatorsValueViewModel();
  const { formattedIndicatorsRows, startDate } = useLiveIndicatorsValueViewModel();

  const formattedAdvencedIndicatorsRows = [
    ...(formattedHistoryIndicatorsRows || []),
    ...(formattedIndicatorsRows || []),
  ];

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

  return <AdvancedMultiLineChart onLoadData={handleLoadData} data={formattedAdvencedIndicatorsRows || []} />;
}
