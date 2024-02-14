'use client';
import { useIndicatorsValueViewModel } from '@/app/business/hooks/use-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import MultiLineChart from '../view/molocule/multi-line-chart';
import { useMemo } from 'react';
import Pending from '../view/molocule/pending';
import EditableText from '../view/atom/editable-text';
import { useDebouncedCallback } from 'use-debounce';

export default function IndicatorsChart() {
  const { selectedMetadata, updateMetadata } = useSelectedIndicatorBoardMetadata();
  const { indciatorsValueViewModel, isPending } = useIndicatorsValueViewModel();

  const formattedIndicatorsRows = useMemo(
    () => indciatorsValueViewModel?.formattedIndicatorsInRow,
    [indciatorsValueViewModel],
  );

  const category = indciatorsValueViewModel?.tickerList ? indciatorsValueViewModel.tickerList : [];

  const handleMetadataNameChange = useDebouncedCallback((name: string) => {
    updateMetadata({
      name,
    });
  }, 500);

  return (
    <>
      <Pending isPending={isPending}>
        <EditableText
          inputKey={selectedMetadata?.id}
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
