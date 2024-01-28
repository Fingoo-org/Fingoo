import { CreateIndicatorMetadataRequestBody } from '../api/command/numerical-guidance.command';
import { IndicatorBoardMetadataListResponse } from '../api/query/numerical-guidance.query';
import { IndicatorListResponse } from '../api/query/numerical-guidance.query';

type MockDatabase = IndicatorBoardMetadataListResponse & IndicatorListResponse;

type MockDatabaseAction = {
  getMetadataList: () => IndicatorBoardMetadataListResponse;
  postMetadataList: (newMetadata: CreateIndicatorMetadataRequestBody) => void;
  getIndicatorList: () => IndicatorListResponse;
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
};

export const resetMockDB = () => {
  Object.assign(mockDatabaseStore, initialState);
};
