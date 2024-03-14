import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import MultiLineChart from '../../view/molocule/multi-line-chart/multi-line-chart';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export default function SimpleIndicatorsChart() {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { indicatorsValue, formattedIndicatorsRows } = useLiveIndicatorsValueViewModel();

  const category = indicatorsValue?.tickerList ? indicatorsValue.tickerList : [];

  return (
    <MultiLineChart
      data={formattedIndicatorsRows || []}
      categories={category}
      noDataText={selectedMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'}
    />
  );
}
