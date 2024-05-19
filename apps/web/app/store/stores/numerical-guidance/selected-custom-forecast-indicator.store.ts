import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { CustomForecastIndicatorResponse } from '../../querys/numerical-guidance/custom-forecast-indicator.query';
import { deepEqual } from '@/app/utils/helper';
import { IndicatorType } from './indicator-list.store';

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
  addSourceIndicator: (indicatorId: string, indicatorType: IndicatorType) => void;
  deleteSourceIndicator: (indicatorId: string) => void;
  updateSourceIndicatorWeight: (indicatorId: string, weight: number) => void;
  initialize: () => void;
};

type SelectedCustomForecastIndicatorStore = SelectedCustomForecastIndicatorState & {
  actions: SelectedCustomForecastIndicatorAction;
};

const initialCustomForecastIndicatorState: SelectedCustomForecastIndicatorState = {
  selectedCustomForecastIndicator: {
    id: '',
    customForecastIndicatorName: '',
    targetIndicator: {
      symbol: '',
      targetIndicatorId: '',
      indicatorType: 'stocks',
    },
    sourceIndicatorsInformation: [],
    grangerVerification: [],
    cointJohansenVerification: [],
    type: 'customForecastIndicator',
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
      initialize: () => {
        set((state) => {
          MemorizedCustomForecastIndicator = structuredClone(state.selectedCustomForecastIndicator);
          return {
            ...state,
            isUpdated: false,
          };
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
      addSourceIndicator: (indicatorId, indicatorType) => {
        get().actions.update((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorsInformation: [
              ...state.selectedCustomForecastIndicator.sourceIndicatorsInformation,
              { sourceIndicatorId: indicatorId, weight: 0, indicatorType },
            ],
          },
        }));
      },
      deleteSourceIndicator: (indicatorId) => {
        get().actions.update((state) => ({
          ...state,
          selectedCustomForecastIndicator: {
            ...state.selectedCustomForecastIndicator,
            sourceIndicatorsInformation: state.selectedCustomForecastIndicator.sourceIndicatorsInformation.filter(
              (sourceIndicator) => sourceIndicator.sourceIndicatorId !== indicatorId,
            ),
          },
        }));
      },
      updateSourceIndicatorWeight(indicatorId, weight) {
        get().actions.update((state) => {
          const sourceIndicatorsInformation = state.selectedCustomForecastIndicator.sourceIndicatorsInformation.map(
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
              sourceIndicatorsInformation,
            },
          };
        });
      },
    },
  };
});
