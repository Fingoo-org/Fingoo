import { useMemo } from 'react';
import { useFetchIndicatorsValue } from '../../../store/querys/numerical-guidance/indicator.query';
import { convertIndicatorsValueViewModel } from '../../services/view-model/indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export const useIndicatorsValueViewModel = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { data: indicatorsValueData, isLoading } = useFetchIndicatorsValue(selectedMetadata?.indicators);

  const convertedIndciatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    return convertIndicatorsValueViewModel(indicatorsValueData);
  }, [indicatorsValueData]);

  return {
    indicatorsValue: convertedIndciatorsValue,
    isPending: isLoading,
  };
};
