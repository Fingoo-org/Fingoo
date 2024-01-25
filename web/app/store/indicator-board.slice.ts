import { StateCreator } from 'zustand';
import { sliceResetFns } from '.';
import { IndicatorBoardMetadataSlice } from './indicator-board-metadata.slice';

type Interval = 'day' | 'week' | 'month' | 'year';

type IndicatorBoardState = {
  boardId: string;
  selectedMetaDataID: string | null;
  interval: Interval;
};

type IndicatorBoardAction = {
  selectMetaData: (MetadataId: string) => void;
};

export type IndicatorBoardSlice = IndicatorBoardState & IndicatorBoardAction;

const initialIndicatorBoardState: IndicatorBoardState = {
  boardId: 'test',
  selectedMetaDataID: null,
  interval: 'day',
};

export const createIndicatorBoardSlice: StateCreator<
  IndicatorBoardSlice & IndicatorBoardMetadataSlice,
  [],
  [],
  IndicatorBoardSlice
> = (set) => {
  sliceResetFns.add(() => set(initialIndicatorBoardState));
  return {
    ...initialIndicatorBoardState,
    selectMetaData: (MetadataId: string) => set({ selectedMetaDataID: MetadataId }),
  };
};
