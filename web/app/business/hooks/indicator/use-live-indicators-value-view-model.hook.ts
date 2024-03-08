import { useMemo } from 'react';
import { useFetchLiveIndicatorsValue } from '../../../store/querys/numerical-guidance/indicator.query';
import { convertLiveIndicatorsValueViewModel } from '../../services/view-model/indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export const useLiveIndicatorsValueViewModel = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { data: indicatorsValueData, isLoading } = useFetchLiveIndicatorsValue(selectedMetadata?.indicatorIds);

  const convertedIndciatorsValue = useMemo(() => {
    if (!indicatorsValueData) return undefined;

    return convertLiveIndicatorsValueViewModel(indicatorsValueData);
  }, [indicatorsValueData]);

  const formattedIndicatorsRows = useMemo(
    () => convertedIndciatorsValue?.formattedIndicatorsInRow,
    [convertedIndciatorsValue],
  );

  return {
    indicatorsValue: convertedIndciatorsValue,
    isPending: isLoading,
    formattedIndicatorsRows,
  };
};
