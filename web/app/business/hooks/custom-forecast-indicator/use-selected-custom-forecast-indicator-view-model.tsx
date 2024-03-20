import { useFetchCustomForecastIndicatorList } from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useEffect, useMemo } from 'react';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useFetchIndicatorList } from '@/app/store/querys/numerical-guidance/indicator.query';
import { useSelectedCustomForecastIndicatorStore } from '@/app/store/stores/numerical-guidance/selected-custom-forecast-indicator.store';

export const useSelectedCustomForecastIndicatorViewModel = () => {
  const selectedCustomForecastIndicatorId = useWorkspaceStore((state) => state.selectedCustomForecastIndicatorId);
  const { selectCustomForecastIndicatorById } = useWorkspaceStore((state) => state.actions);
  const { selectedCustomForecastIndicator, isUpdated } = useSelectedCustomForecastIndicatorStore((state) => state);
  const selectedCustomerForecastIndicatorActions = useSelectedCustomForecastIndicatorStore((state) => state.actions);
  const { data: customForecastIndicatorList } = useFetchCustomForecastIndicatorList();
  const { data: indicatorList } = useFetchIndicatorList();

  const foundCustomForecastIndicator = customForecastIndicatorList?.find(
    (customForecastIndicator) => customForecastIndicator.id === selectedCustomForecastIndicatorId,
  );

  useEffect(() => {
    if (!foundCustomForecastIndicator) return;
    if (selectedCustomForecastIndicator.id === foundCustomForecastIndicator.id) return;

    selectedCustomerForecastIndicatorActions.enroll(foundCustomForecastIndicator);
  }, [foundCustomForecastIndicator]);

  const convertedSelectedCustomForecastIndicator = useMemo(
    () => convertCustomForecastIndicatorViewModel(selectedCustomForecastIndicator),
    [selectedCustomForecastIndicator],
  );

  const sourceIndicatorIds = convertedSelectedCustomForecastIndicator?.sourceIndicatorIds;

  const sourceIndicatorList = useMemo(() => {
    if (!sourceIndicatorIds) return [];

    return indicatorList
      ?.filter((indicator) => sourceIndicatorIds.includes(indicator.id))
      .map((indicator) => {
        return {
          ...indicator,
          weight: convertedSelectedCustomForecastIndicator.getSourceIndicatorWeight(indicator.id)!,
        };
      });
  }, [indicatorList, sourceIndicatorIds]);

  const addSourceIndicator = (indicatorId: string) => {
    selectedCustomerForecastIndicatorActions.addSourceIndicator(indicatorId);
  };

  const deleteSourceIndicator = (indicatorId: string) => {
    selectedCustomerForecastIndicatorActions.deleteSourceIndicator(indicatorId);
  };

  const updateSourceIndicatorWeight = (indicatorId: string, weight: number) => {
    selectedCustomerForecastIndicatorActions.updateSourceIndicatorWeight(indicatorId, weight);
  };

  return {
    selectedCustomForecastIndicator: convertedSelectedCustomForecastIndicator,
    sourceIndicatorList,
    isUpdated,
    selectCustomForecastIndicatorById,
    addSourceIndicator,
    deleteSourceIndicator,
    updateSourceIndicatorWeight,
  };
};
