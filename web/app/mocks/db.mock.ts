import {
  CreateIndicatorMetadataRequestBody,
  UpdateIndicatorBoardMetadataRequestBody,
} from '../store/querys/numerical-guidance/indicator-board-metadata.query';
import { IndicatorValueResponse, IndicatorsValueResponse } from '../store/querys/numerical-guidance/indicator.query';
import {
  IndicatorBoardMetadataListResponse,
  IndicatorBoardMetadataResponse,
} from '../store/querys/numerical-guidance/indicator-board-metadata.query';
import { IndicatorListResponse } from '../store/querys/numerical-guidance/indicator.query';
import { AddIndicatorToMetadataRequestBody } from '../store/querys/numerical-guidance/indicator-board-metadata.query';
import { indicatorsValueMockData } from './mock-data/indicators-value.mock';

type MockDatabase = IndicatorBoardMetadataListResponse & IndicatorListResponse & IndicatorsValueResponse;

type MockDatabaseAction = {
  getMetadataList: () => IndicatorBoardMetadataListResponse;
  postMetadataList: (newMetadata: CreateIndicatorMetadataRequestBody) => void;
  getIndicatorList: () => IndicatorListResponse;
  getMetadata: (id: string) => IndicatorBoardMetadataResponse | undefined;
  postIndicatorToMetadata: (id: string, data: AddIndicatorToMetadataRequestBody) => void;
  deleteIndicatorFromMetadata: (id: string, indicatorKey: string) => void;
  getIndicatorValue: (ticker: string) => IndicatorValueResponse | undefined;
  patchMetadata: (id: string, data: UpdateIndicatorBoardMetadataRequestBody) => void;
  deleteMetadata: (id: string) => void;
};

const initialState: MockDatabase = {
  metadataList: [
    {
      id: '1',
      name: 'metadata1',
      tickers: [],
    },
    {
      id: '2',
      name: 'metadata2',
      tickers: [],
    },
    {
      id: '3',
      name: 'metadata3',
      tickers: [],
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
  indicatorsValue: indicatorsValueMockData,
};

// mock이라 성능상의 문제가 필요 없음으로 사용
function initStore(): MockDatabase {
  return JSON.parse(JSON.stringify(initialState));
}

let mockDatabaseStore = initStore();

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
      tickers: [...mockDatabaseStore.metadataList[index].tickers, data],
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteIndicatorFromMetadata: (id, indicatorKey) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      tickers: mockDatabaseStore.metadataList[index].tickers.filter((ticker) => ticker.ticker !== indicatorKey),
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  getIndicatorValue: (ticker) => {
    return mockDatabaseStore.indicatorsValue.find((indicator) => indicator.ticker === ticker);
  },
  patchMetadata: (id, data) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      ...data,
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteMetadata: (id) => {
    mockDatabaseStore.metadataList = mockDatabaseStore.metadataList.filter((metadata) => metadata.id !== id);
  },
};

export const resetMockDB = () => {
  mockDatabaseStore = initStore();
};
