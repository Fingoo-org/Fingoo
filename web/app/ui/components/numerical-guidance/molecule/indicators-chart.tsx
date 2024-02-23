'use client';
import { useIndicatorsValueViewModel } from '@/app/business/hooks/use-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata-view-model.hook';
import MultiLineChart from '../../view/molocule/multi-line-chart';
import { useMemo } from 'react';
import Pending from '../../view/molocule/pending';
import SelectedMetadataTittle from '../atom/selected-metadata-title';
import ToggleButton from '../../view/atom/toggle-button/toggle-button';
import { CheckCircleIcon } from '@heroicons/react/outline';

export default function IndicatorsChart() {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { indicatorsValue, isPending } = useIndicatorsValueViewModel();

  const formattedIndicatorsRows = useMemo(() => indicatorsValue?.formattedIndicatorsInRow, [indicatorsValue]);

  const category = indicatorsValue?.tickerList ? indicatorsValue.tickerList : [];

  return (
    <>
      <Pending isPending={isPending}>
        <div className="flex items-center justify-center">
          <SelectedMetadataTittle />
        </div>
        <div>
          <ToggleButton disabled={selectedMetadata ? false : true} icon={CheckCircleIcon} text={'자세한 차트'} />
        </div>
        <MultiLineChart
          data={formattedIndicatorsRows || []}
          categories={category}
          noDataText={selectedMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'}
        />
      </Pending>
    </>
  );
}
