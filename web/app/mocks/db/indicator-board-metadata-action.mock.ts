import {
  IndicatorBoardMetadataResponse,
  CreateIndicatorMetadataRequestBody,
  AddIndicatorToMetadataRequestBody,
  UpdateIndicatorBoardMetadataRequestBody,
  AddCustomForecastIndicatorToMetadataRequestBody,
  CreateIndicatorMetadataResponse,
  UpdateIndicatorBoardMetadataSectionsRequestBody,
} from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { mockDatabaseStore } from '.';

export type MockIndicatorBoardMetadataAction = {
  getMetadataList: () => IndicatorBoardMetadataResponse[];
  postMetadataList: (newMetadata: CreateIndicatorMetadataRequestBody) => CreateIndicatorMetadataResponse;
  getMetadata: (id: string) => IndicatorBoardMetadataResponse | undefined;
  postIndicatorToMetadata: (id: string, data: AddIndicatorToMetadataRequestBody) => void;
  deleteIndicatorFromMetadata: (id: string, indicatorId: string) => void;
  patchMetadata: (id: string, data: UpdateIndicatorBoardMetadataRequestBody) => void;
  deleteIndicatorBoardMetadata: (id: string) => void;
  postCustomForecastIndicatorToMetadata: (id: string, data: AddCustomForecastIndicatorToMetadataRequestBody) => void;
  deleteCustomForecastIndicatorFromMetadata: (id: string, customForecastIndicatorId: string) => void;
  patchIndicatorIdsWithsectionIds: (id: string, data: UpdateIndicatorBoardMetadataSectionsRequestBody) => void;
};

export const mockIndicatorBoardMetadataAction: MockIndicatorBoardMetadataAction = {
  getMetadataList: () => {
    return mockDatabaseStore.metadataList;
  },
  postMetadataList: (data) => {
    const id = Math.random().toString(36);
    const newMetadata = {
      ...data,
      id,
      indicatorIds: [],
      customForecastIndicatorIds: [],
      sections: {
        section1: [],
      },
    };
    mockDatabaseStore.metadataList = [...mockDatabaseStore.metadataList, newMetadata];
    return id;
  },
  getMetadata: (id) => {
    return mockDatabaseStore.metadataList.find((metadata) => metadata.id === id);
  },
  postIndicatorToMetadata: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const lastsectionId = Object.keys(mockDatabaseStore.metadataList[index].sections).length;
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicatorIds: [...mockDatabaseStore.metadataList[index].indicatorIds, data.indicatorId],
      sections: {
        ...mockDatabaseStore.metadataList[index].sections,
        [`section${lastsectionId}`]: [
          ...mockDatabaseStore.metadataList[index].sections[`section${lastsectionId}`],
          data.indicatorId,
        ],
      },
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteIndicatorFromMetadata: (id, indicatorId) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicatorIds: mockDatabaseStore.metadataList[index].indicatorIds.filter((id) => id !== indicatorId),
      sections: Object.entries(mockDatabaseStore.metadataList[index].sections).reduce<{
        [key: string]: string[];
      }>((acc, [key, value]) => {
        acc[key] = value.filter((id) => id !== indicatorId);
        return acc;
      }, {}),
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  patchMetadata: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicatorBoardMetadataName: data.name,
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteIndicatorBoardMetadata: (id) => {
    mockDatabaseStore.metadataList = mockDatabaseStore.metadataList.filter((metadata) => metadata.id !== id);
  },
  postCustomForecastIndicatorToMetadata: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const lastsectionId = Object.keys(mockDatabaseStore.metadataList[index].sections).length;
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      customForecastIndicatorIds: [
        ...mockDatabaseStore.metadataList[index].customForecastIndicatorIds,
        data.customForecastIndicatorId,
      ],
      sections: {
        ...mockDatabaseStore.metadataList[index].sections,
        [`section${lastsectionId}`]: [
          ...mockDatabaseStore.metadataList[index].sections[`section${lastsectionId}`],
          data.customForecastIndicatorId,
        ],
      },
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteCustomForecastIndicatorFromMetadata: (id, customForecastIndicatorId) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      customForecastIndicatorIds: mockDatabaseStore.metadataList[index].customForecastIndicatorIds.filter(
        (id) => id !== customForecastIndicatorId,
      ),
      sections: Object.entries(mockDatabaseStore.metadataList[index].sections).reduce<{
        [key: string]: string[];
      }>((acc, [key, value]) => {
        acc[key] = value.filter((id) => id !== customForecastIndicatorId);
        return acc;
      }, {}),
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  patchIndicatorIdsWithsectionIds: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      sections: {
        ...data.sections,
      },
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
};
