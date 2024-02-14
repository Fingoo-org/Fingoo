'use client';
import { useIndicatorsValueViewModel } from '@/app/business/hooks/use-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import MultiLineChart from '../view/molocule/multi-line-chart';
import { useMemo } from 'react';
import Pending from '../view/molocule/pending';
import EditableText from '../view/atom/editable-text';
import { useUpdateIndicatorBoardMetadata } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

export default function IndicatorsChart() {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { trigger } = useUpdateIndicatorBoardMetadata(selectedMetadata?.id);
  const { indciatorsValueViewModel, isPending } = useIndicatorsValueViewModel();

  const formattedIndicatorsRows = useMemo(
    () => indciatorsValueViewModel?.formattedIndicatorsInRow,
    [indciatorsValueViewModel],
  );

  const category = indciatorsValueViewModel?.tickerList ? indciatorsValueViewModel.tickerList : [];

  const handleMetadataNameChange = (name: string) => {
    trigger({
      name,
    });
  };

  return (
    <>
      <Pending isPending={isPending}>
        <EditableText
          onChange={handleMetadataNameChange}
          readonly={selectedMetadata ? false : true}
          className="w-40 text-lg font-medium p-0"
          text={selectedMetadata ? selectedMetadata.name : 'No metadata'}
        />
        <MultiLineChart
          data={formattedIndicatorsRows || []}
          categories={category}
          noDataText={selectedMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'}
        />
      </Pending>
    </>
  );
}
