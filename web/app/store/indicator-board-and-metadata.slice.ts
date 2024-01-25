import { StateCreator } from 'zustand';
import { IndicatorBoardSlice } from './indicator-board.slice';
import { IndicatorBoardMetadata, IndicatorBoardMetadataSlice } from './indicator-board-metadata.slice';

export type IndicatorBoardAndMetadataSlice = {
  createAndSelectMetadata: (metadata: IndicatorBoardMetadata) => void;
};

export const createIndicatorBoardAndMetadataSlice: StateCreator<
  IndicatorBoardAndMetadataSlice & IndicatorBoardMetadataSlice & IndicatorBoardSlice,
  [],
  [],
  IndicatorBoardAndMetadataSlice
> = (set, get) => ({
  createAndSelectMetadata: (metadata) => {
    get().addMetadata(metadata);
    get().selectMetaData(metadata.id);
  },
});
