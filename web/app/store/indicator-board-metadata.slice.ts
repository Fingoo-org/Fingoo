import { StateCreator } from 'zustand';
import { sliceResetFns } from '.';
import { IndicatorBoardSlice } from './indicator-board.slice';

export type Indicator = {
  id: string;
};

export type IndicatorBoardMetadata = {
  id: string;
  name: string;
  indicators: Indicator[];
};

type IndicatorBoardMetadataState = {
  metadataList: IndicatorBoardMetadata[];
};

type IndicatorBoardMetadataAction = {
  addMetaData: (metaData: IndicatorBoardMetadata) => void;
};

export type IndicatorBoardMetadataSlice = IndicatorBoardMetadataState & IndicatorBoardMetadataAction;

const initialIndicatorBoardMetadataState: IndicatorBoardMetadataState = {
  metadataList: [],
};

export const createIndicatorBoardMetadataSlice: StateCreator<
  IndicatorBoardMetadataSlice & IndicatorBoardSlice,
  [],
  [],
  IndicatorBoardMetadataSlice
> = (set) => {
  sliceResetFns.add(() => set(initialIndicatorBoardMetadataState));
  return {
    ...initialIndicatorBoardMetadataState,
    addMetaData: (metaData: IndicatorBoardMetadata) =>
      set((state) => ({ metadataList: [...state.metadataList, metaData] })),
  };
};
