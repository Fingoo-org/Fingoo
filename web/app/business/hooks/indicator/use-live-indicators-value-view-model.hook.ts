import { useMemo } from 'react';
import { useFetchLiveIndicatorsValue } from '../../../store/querys/numerical-guidance/indicator.query';
import { convertLiveIndicatorsValueViewModel } from '../../services/view-model/indicator-value/actual-indicators-value-view-model.service';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

export const useLiveIndicatorsValueViewModel = (indicatorBoardMetadataId?: string) => {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const interval = useWorkspaceStore((state) => state.interval);
  const { data: indicatorsValueData, isLoading } = useFetchLiveIndicatorsValue(
    indicatorBoardMetadata?.indicatorIds,
    interval,
  );

  const convertedIndciatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    return convertLiveIndicatorsValueViewModel(indicatorsValueData);
  }, [indicatorsValueData]);

  return {
    indicatorsValue: convertedIndciatorsValue,
    isPending: isLoading,
  };
};
