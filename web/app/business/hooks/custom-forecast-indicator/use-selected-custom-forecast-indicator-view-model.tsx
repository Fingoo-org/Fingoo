import {
  CustomForecastIndicatorResponse,
  useFetchCustomForecastIndicatorList,
  useUpdateCustomForecastIndicatorName,
  useUpdateSourceIndicator,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastIndicatorViewModel } from '../../services/view-model/custom-forecast-indicator-view-model.service';
import { useEffect, useMemo } from 'react';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useFetchIndicatorList } from '@/app/store/querys/numerical-guidance/indicator.query';
import { useSelectedCustomForecastIndicatorStore } from '@/app/store/stores/numerical-guidance/selected-custom-forecast-indicator.store';
import { usePending } from '@/app/ui/components/view/hooks/usePending.hook';

export const useSelectedCustomForecastIndicatorViewModel = () => {
  const selectedCustomForecastIndicatorId = useWorkspaceStore((state) => state.selectedCustomForecastIndicatorId);
  const { selectCustomForecastIndicatorById } = useWorkspaceStore((state) => state.actions);

  const { selectedCustomForecastIndicator, isUpdated } = useSelectedCustomForecastIndicatorStore((state) => state);
  const selectedCustomerForecastIndicatorActions = useSelectedCustomForecastIndicatorStore((state) => state.actions);

  const { data: customForecastIndicatorList, isValidating } = useFetchCustomForecastIndicatorList();
  const { data: indicatorList } = useFetchIndicatorList();

  const { trigger: updateSourceIndicatorTrigger, isMutating: isUpdateSourceIndicatorMutating } =
    useUpdateSourceIndicator(selectedCustomForecastIndicatorId);
  const { trigger: updateCustomForecastIndicatorNameTrigger } = useUpdateCustomForecastIndicatorName(
    selectedCustomForecastIndicatorId,
  );

  const { isPending } = usePending(isValidating, isUpdateSourceIndicatorMutating);

  const foundCustomForecastIndicator = customForecastIndicatorList?.find(
    (customForecastIndicator) => customForecastIndicator.id === selectedCustomForecastIndicatorId,
  );

  useEffect(() => {
    if (!foundCustomForecastIndicator) return;
    if (selectedCustomForecastIndicator.id === foundCustomForecastIndicator.id) return;

    selectedCustomerForecastIndicatorActions.enroll(foundCustomForecastIndicator);
  }, [foundCustomForecastIndicator]);

  const convertedSelectedCustomForecastIndicator = useMemo(
    () =>
      convertCustomForecastIndicatorViewModel({
        ...selectedCustomForecastIndicator,
        customForecastIndicatorName: foundCustomForecastIndicator?.customForecastIndicatorName ?? '',
        grangerVerification: foundCustomForecastIndicator?.grangerVerification ?? [],
        cointJohansenVerification: foundCustomForecastIndicator?.cointJohansenVerification ?? [],
      }),
    [foundCustomForecastIndicator, selectedCustomForecastIndicator],
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
          disabled: !convertedSelectedCustomForecastIndicator.checkGrantedVerificationBySourceIndicatorId(indicator.id),
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

  const applyUpdatedSourceIndicator = async () => {
    await updateSourceIndicatorTrigger(
      {
        sourceIndicatorIdsAndWeights: convertedSelectedCustomForecastIndicator.sourceIndicatorIdsAndWeights,
      },
      {
        onSuccess: () => {
          selectedCustomerForecastIndicatorActions.initialize();
        },
      },
    );
  };

  const updateCustomForecastIndicatorName = (name: string) => {
    updateCustomForecastIndicatorNameTrigger(
      {
        name,
      },
      {
        optimisticData: (data) => {
          const currentData = data as unknown as CustomForecastIndicatorResponse[];
          return currentData.map((customForecastIndicator) => {
            if (customForecastIndicator.id === selectedCustomForecastIndicatorId) {
              return {
                ...customForecastIndicator,
                customForecastIndicatorName: name,
              };
            }
            return customForecastIndicator;
          });
        },
      },
    );
  };

  return {
    selectedCustomForecastIndicator: convertedSelectedCustomForecastIndicator,
    sourceIndicatorList,
    isUpdated,
    isPending,
    selectCustomForecastIndicatorById,
    addSourceIndicator,
    deleteSourceIndicator,
    updateSourceIndicatorWeight,
    applyUpdatedSourceIndicator,
    updateCustomForecastIndicatorName,
  };
};
