'use client';
import { useIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import MultiLineChart from '../../view/molocule/multi-line-chart';
import Pending from '../../view/molocule/pending';
import SelectedMetadataTittle from '../indicator-board-metadata/selected-metadata-title';
import ToggleButton from '../../view/atom/toggle-button/toggle-button';
import { CheckCircleIcon } from '@heroicons/react/outline';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';
import AdvancedIndicatorsChart from './advanced-indicators-chart';

export default function IndicatorsChart() {
  const { isAdvancedChart, setIsAdvancedChart } = useIndicatorBoard();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { indicatorsValue, formattedIndicatorsRows, isPending } = useIndicatorsValueViewModel();

  const category = indicatorsValue?.tickerList ? indicatorsValue.tickerList : [];

  const handleToggle = (active: boolean) => {
    setIsAdvancedChart(active);
  };

  return (
    <>
      <Pending isPending={isPending}>
        <div className="flex items-center justify-center">
          <SelectedMetadataTittle />
        </div>
        <div>
          <ToggleButton
            onToggle={handleToggle}
            disabled={selectedMetadata && formattedIndicatorsRows ? false : true}
            icon={CheckCircleIcon}
            text={'자세한 차트'}
          />
        </div>
        <div className="mt-4 h-72 w-full">
          {isAdvancedChart ? (
            <AdvancedIndicatorsChart />
          ) : (
            <MultiLineChart
              data={formattedIndicatorsRows || []}
              categories={category}
              noDataText={
                selectedMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'
              }
            />
          )}
        </div>
      </Pending>
    </>
  );
}
