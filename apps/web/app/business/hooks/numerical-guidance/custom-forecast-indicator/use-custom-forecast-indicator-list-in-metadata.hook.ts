import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { useMemo } from 'react';
import { useIndicatorBoardMetadataViewModel } from '../indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { convertCustomForecastIndicatorsViewModel } from '../../../services/numerical-guidance/view-model/custom-forecast-indicator-view-model.service';

export const useCustomForecastIndicatorListInMetadata = (indicatorBoardMetadataId?: string) => {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const { data: customForecastIndicatorListData } = useFetchCustomForecastIndicatorList();

  const customForecastIndicatorListInMetadata = useMemo(() => {
    if (!customForecastIndicatorListData || !indicatorBoardMetadata) return undefined;

    return customForecastIndicatorListData.filter((customForecastIndicator) => {
      return indicatorBoardMetadata?.customForecastIndicatorIds.includes(customForecastIndicator.id);
    });
  }, [customForecastIndicatorListData, indicatorBoardMetadata]);

  const convertedCustomForecastIndicatorListInMetadata = useMemo(() => {
    if (!customForecastIndicatorListInMetadata) return undefined;

    return convertCustomForecastIndicatorsViewModel(customForecastIndicatorListInMetadata);
  }, [customForecastIndicatorListInMetadata]);

  const targetIndicatorInfo = customForecastIndicatorListInMetadata?.map((customForecastIndicator) => {
    return {
      id: customForecastIndicator.targetIndicator.id,
      indicatorType: customForecastIndicator.targetIndicator.indicatorType,
    };
  });

  const targetIndicatorIds = targetIndicatorInfo?.map((targetIndicator) => targetIndicator.id);

  return {
    customForecastIndicatorListInMetadata: convertedCustomForecastIndicatorListInMetadata,
    targetIndicatorInfo,
    targetIndicatorIds,
  };
};
