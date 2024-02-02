import { useMemo } from 'react';
import { useFetchIndicatorsValue } from '../api/query/numerical-guidance.query';
import { convertIndicatorsValueViewModel } from '../services/indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from './use-selected-indicator-board-metadata.hook';

export const useIndicatorsValueViewModel = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { data: indicatorsValueData } = useFetchIndicatorsValue(selectedMetadata?.indicators ?? []);

  const indciatorsValueViewModel = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    return convertIndicatorsValueViewModel(indicatorsValueData);
  }, [indicatorsValueData]);

  return {
    indicatorsValue: indciatorsValueViewModel,
  };
};
