import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-history-indicators-value-view-model.hook';
import AdvancedMultiLineChart from '../../view/molocule/advanced-multi-line-chart/advanced-multi-line-chart';
import { useIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-indicators-value-view-model.hook';

export default function AdvancedIndicatorsChart() {
  const { formattedHistoryIndicatorsRows, setPaginationData } = useHistoryIndicatorsValueViewModel();
  const { formattedIndicatorsRows } = useIndicatorsValueViewModel();

  const formattedAdvencedIndicatorsRows = [
    ...(formattedHistoryIndicatorsRows || []),
    ...(formattedIndicatorsRows || []),
  ];

  const handleLoadData = (rowsToDownload: number, initialIndex: number) => {
    setPaginationData({
      rowsToDownload,
    });
  };

  return <AdvancedMultiLineChart onLoadData={handleLoadData} data={formattedAdvencedIndicatorsRows || []} />;
}
