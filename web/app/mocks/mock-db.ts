import { CreateIndicatorMetadataRequestBody } from '../api/command/numerical-guidance.command';
import {
  IndicatorBoardMetadataListResponse,
  IndicatorBoardMetadataResponse,
} from '../api/query/numerical-guidance.query';
import { IndicatorListResponse } from '../api/query/numerical-guidance.query';
import { AddIndicatorToMetadataRequestBody } from '../api/command/numerical-guidance.command';

type MockDatabase = IndicatorBoardMetadataListResponse & IndicatorListResponse;

type MockDatabaseAction = {
  getMetadataList: () => IndicatorBoardMetadataListResponse;
  postMetadataList: (newMetadata: CreateIndicatorMetadataRequestBody) => void;
  getIndicatorList: () => IndicatorListResponse;
  getMetadata: (id: string) => IndicatorBoardMetadataResponse | undefined;
  postIndicatorToMetadata: (id: string, data: AddIndicatorToMetadataRequestBody) => void;
  deleteIndicatorFromMetadata: (id: string, indicatorKey: string) => void;
};

const initialState: MockDatabase = {
  metadataList: [
    {
      id: '1',
      name: 'metadata1',
      indicators: [],
    },
    {
      id: '2',
      name: 'metadata2',
      indicators: [],
    },
    {
      id: '3',
      name: 'metadata3',
      indicators: [],
    },
  ],
  indicatorList: [
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
    },
    {
      ticker: 'GOOG',
      name: 'Alphabet Inc.',
    },
  ],
};

const mockDatabaseStore = {
  ...initialState,
};

export const mockDB: MockDatabaseAction = {
  getMetadataList: () => {
    return {
      metadataList: mockDatabaseStore.metadataList,
    };
  },
  postMetadataList: (newMetadata) => {
    mockDatabaseStore.metadataList = [...mockDatabaseStore.metadataList, newMetadata];
  },
  getIndicatorList: () => {
    return {
      indicatorList: mockDatabaseStore.indicatorList,
    };
  },
  getMetadata: (id) => {
    return mockDatabaseStore.metadataList.find((metadata) => metadata.id === id);
  },
  postIndicatorToMetadata: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicators: [...mockDatabaseStore.metadataList[index].indicators, data],
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteIndicatorFromMetadata: (id, indicatorKey) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicators: mockDatabaseStore.metadataList[index].indicators.filter(
        (indicator) => indicator.ticker !== indicatorKey,
      ),
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
};

export const resetMockDB = () => {
  Object.assign(mockDatabaseStore, initialState);
};
