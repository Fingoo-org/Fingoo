import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { CustomForecastIndicatorResponse } from '../../querys/numerical-guidance/custom-forecast-indicator.query';
import { deepEqual } from '@/app/utils/helper';

type SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: CustomForecastIndicatorResponse;
  isUpdated: boolean;
};

type SelectedCustomForecastIndicatorAction = {
  enroll: (customForecastIndicator: CustomForecastIndicatorResponse) => void;
  update: (
    fn: (
      state: SelectedCustomForecastIndicatorStore,
    ) => SelectedCustomForecastIndicatorStore | Partial<SelectedCustomForecastIndicatorStore>,
  ) => void;
  addSourceIndicator: (indicatorId: string) => void;
  deleteSourceIndicator: (indicatorId: string) => void;
  updateSourceIndicatorWeight: (indicatorId: string, weight: number) => void;
};

type SelectedCustomForecastIndicatorStore = SelectedCustomForecastIndicatorState & {
  actions: SelectedCustomForecastIndicatorAction;
};

const initialCustomForecastIndicatorState: SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: {
    id: '',
    customForecastIndicatorName: '',
    targetIndicatorId: '',
    sourceIndicatorIdsAndWeights: [],
  },
  isUpdated: false,
};

export const useSelectedCustomForecastIndicatorStore = create<SelectedCustomForecastIndicatorStore>((set, get) => {
  let MemorizedCustomForecastIndicator: CustomForecastIndicatorResponse;
  storeResetFns.add(() => set(initialCustomForecastIndicatorState));
  return {
    ...initialCustomForecastIndicatorState,
    actions: {
      enroll: (customForecastIndicator) => {
        MemorizedCustomForecastIndicator = structuredClone(customForecastIndicator);
        set({
          selectedCustomForecastIndicator: { ...customForecastIndicator },
        });
      },
      update: (fn) => {
        set((state) => {
          const newState = fn(state);
          const isUpdated = deepEqual(MemorizedCustomForecastIndicator, newState.selectedCustomForecastIndicator)
            ? false
            : true;
          return {
            ...newState,
            isUpdated,
          };
        });
      },
      addSourceIndicator: (indicatorId) => {
        get().actions.update((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorIdsAndWeights: [
              ...state.selectedCustomForecastIndicator.sourceIndicatorIdsAndWeights,
              { sourceIndicatorId: indicatorId, weight: 0 },
            ],
          },
        }));
      },
      deleteSourceIndicator: (indicatorId) => {
        get().actions.update((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorIdsAndWeights: state.selectedCustomForecastIndicator.sourceIndicatorIdsAndWeights.filter(
              (sourceIndicator) => sourceIndicator.sourceIndicatorId !== indicatorId,
            ),
          },
        }));
      },
      updateSourceIndicatorWeight(indicatorId, weight) {
        get().actions.update((state) => {
          const sourceIndicatorIdsAndWeights = state.selectedCustomForecastIndicator.sourceIndicatorIdsAndWeights.map(
            (sourceIndicator) => {
              if (sourceIndicator.sourceIndicatorId === indicatorId) {
                return { ...sourceIndicator, weight };
              }
              return sourceIndicator;
            },
          );
          return {
            ...state,
            selectedCustomForecastIndicator: {
              ...state.selectedCustomForecastIndicator,
              sourceIndicatorIdsAndWeights,
            },
          };
        });
      },
    },
  };
});
