import { StateCreator } from 'zustand';
import { sliceResetFns } from '.';
import { IndicatorBoardSlice } from './indicator-board.slice';

type Indicator = {
  id: string;
};

type IndicatorBoardMetadata = {
  id: string;
  name: string;
  indicators: Indicator[];
};

type IndicatorBoardMetadataState = {
  metadataList: IndicatorBoardMetadata[];
};

type IndicatorBoardMetadataAction = {};

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
  };
};
