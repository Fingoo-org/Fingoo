import {
  IndicatorBoardMetadataResponse,
  CreateIndicatorMetadataRequestBody,
  AddIndicatorToMetadataRequestBody,
  UpdateIndicatorBoardMetadataRequestBody,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { mockDatabaseStore } from '.';

export type MockIndicatorBoardMetadataAction = {
  getMetadataList: () => IndicatorBoardMetadataResponse[];
  postMetadataList: (newMetadata: CreateIndicatorMetadataRequestBody) => void;
  getMetadata: (id: string) => IndicatorBoardMetadataResponse | undefined;
  postIndicatorToMetadata: (id: string, data: AddIndicatorToMetadataRequestBody) => void;
  deleteIndicatorFromMetadata: (id: string, indicatorId: string) => void;
  patchMetadata: (id: string, data: UpdateIndicatorBoardMetadataRequestBody) => void;
  deleteIndicatorBoardMetadata: (id: string) => void;
};

export const mockIndicatorBoardMetadataAction: MockIndicatorBoardMetadataAction = {
  getMetadataList: () => {
    return mockDatabaseStore.metadataList;
  },
  postMetadataList: (data) => {
    const newMetadata = {
      ...data,
      indicatorIds: [],
      customForecastIndicatorIds: [],
    };
    mockDatabaseStore.metadataList = [...mockDatabaseStore.metadataList, newMetadata];
  },
  getMetadata: (id) => {
    return mockDatabaseStore.metadataList.find((metadata) => metadata.id === id);
  },
  postIndicatorToMetadata: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicatorIds: [...mockDatabaseStore.metadataList[index].indicatorIds, data.indicatorId],
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteIndicatorFromMetadata: (id, indicatorId) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicatorIds: mockDatabaseStore.metadataList[index].indicatorIds.filter((id) => id !== indicatorId),
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  patchMetadata: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      ...data,
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteIndicatorBoardMetadata: (id) => {
    mockDatabaseStore.metadataList = mockDatabaseStore.metadataList.filter((metadata) => metadata.id !== id);
  },
};
