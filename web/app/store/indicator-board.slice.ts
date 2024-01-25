import { StateCreator } from 'zustand';
import { sliceResetFns } from '.';
import { IndicatorBoardMetadataSlice } from './indicator-board-metadata.slice';

type Interval = 'day' | 'week' | 'month' | 'year';

type IndicatorBoardState = {
  boardId: string;
  selectedMetadataId: string | null;
  interval: Interval;
};

type IndicatorBoardAction = {
  selectMetaData: (MetadataId: string) => void;
};

export type IndicatorBoardSlice = IndicatorBoardState & IndicatorBoardAction;

const initialIndicatorBoardState: IndicatorBoardState = {
  boardId: 'test',
  selectedMetadataId: null,
  interval: 'day',
};

export const createIndicatorBoardSlice: StateCreator<IndicatorBoardSlice, [], [], IndicatorBoardSlice> = (set) => {
  sliceResetFns.add(() => set(initialIndicatorBoardState));
  return {
    ...initialIndicatorBoardState,
    selectMetaData: (MetadataId: string) => set({ selectedMetadataId: MetadataId }),
  };
};
