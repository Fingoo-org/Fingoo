import { create } from 'zustand';
import { storeResetFns } from '../reset-store';
import { UnitType } from '@/app/business/services/numerical-guidance/chart/unit-calculator/unit-calculator-factory.service';

export type IndicatorInMetadataUnitTypes = {
  [metadataId: string]: {
    indicatorId: string;
    unitType: UnitType;
  }[];
};

type IndicatorBoardMetadataState = {
  indicatorsInMetadataUnitType: IndicatorInMetadataUnitTypes;
  isUnitTypeInitialized: boolean;
};

type IndicatorBoardMetadataAction = {
  initIndicatorsInMetadataUnitType: (indicatorsInMetadataUnitType: IndicatorInMetadataUnitTypes) => void;
  updateIndicatorsInMetadataUnitType: (indicatorsInMetadataUnitType: IndicatorInMetadataUnitTypes) => void;
  updateUnitType: (metadataId: string, indicatorId: string, unitType: UnitType) => void;
};

type IndicatorBoardMetadataStore = IndicatorBoardMetadataState & {
  actions: IndicatorBoardMetadataAction;
};

const initialIndicatorBoardState: IndicatorBoardMetadataState = {
  indicatorsInMetadataUnitType: {},
  isUnitTypeInitialized: false,
};

export const useIndicatorBoardMetadataStore = create<IndicatorBoardMetadataStore>((set, get) => {
  storeResetFns.add(() => set({ indicatorsInMetadataUnitType: {} }));
  return {
    ...initialIndicatorBoardState,
    actions: {
      initIndicatorsInMetadataUnitType: (indicatorsInMetadataUnitType) => {
        set({ indicatorsInMetadataUnitType, isUnitTypeInitialized: true });
      },
      updateIndicatorsInMetadataUnitType: (indicatorsInMetadataUnitType) => {
        set((state) => {
          const newIndicatorsInMetadataUnitType = Object.keys(
            indicatorsInMetadataUnitType,
          ).reduce<IndicatorInMetadataUnitTypes>((acc, metadataId) => {
            acc[metadataId] = indicatorsInMetadataUnitType[metadataId].map((indicator) => {
              return {
                ...indicator,
                ...state.indicatorsInMetadataUnitType[metadataId]?.find(
                  (indicatorInMetadata) => indicatorInMetadata.indicatorId === indicator.indicatorId,
                ),
              };
            });
            return acc;
          }, {});

          return { indicatorsInMetadataUnitType: newIndicatorsInMetadataUnitType };
        });
      },
      updateUnitType: (metadataId, indicatorId, unitType) => {
        set((state) => {
          const newIndicatorsInMetadataUnitType = { ...state.indicatorsInMetadataUnitType };
          newIndicatorsInMetadataUnitType[metadataId] = newIndicatorsInMetadataUnitType[metadataId].map((indicator) => {
            if (indicator.indicatorId === indicatorId) {
              return { indicatorId, unitType };
            }
            return indicator;
          });
          return { indicatorsInMetadataUnitType: newIndicatorsInMetadataUnitType };
        });
      },
    },
  };
});
