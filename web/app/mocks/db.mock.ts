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
import {
  CreateCustomForecastIndicatorRequestBody,
  CustomForecastIndicatorListResponse,
} from '../store/querys/numerical-guidance/custom-forecast-indicator.query';

type MockDatabase = IndicatorBoardMetadataListResponse &
  IndicatorListResponse &
  IndicatorsValueResponse &
  CustomForecastIndicatorListResponse;

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
  getCustomForecastIndicatorList: () => CustomForecastIndicatorListResponse;
  postCustomForecastIndicator: (data: CreateCustomForecastIndicatorRequestBody) => void;
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
  customForecastIndicatorList: [
    {
      id: '1',
      name: 'customForecastIndicator1',
      targetIndicatorId: 'AAPL',
      sourceIndicatorIds: ['MSFT', 'GOOG'],
    },
    {
      id: '2',
      name: 'customForecastIndicator2',
      targetIndicatorId: 'MSFT',
      sourceIndicatorIds: ['AAPL', 'GOOG'],
    },
    {
      id: '3',
      name: 'customForecastIndicator3',
      targetIndicatorId: 'GOOG',
      sourceIndicatorIds: ['AAPL', 'MSFT'],
    },
  ],
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
  getCustomForecastIndicatorList: () => {
    return {
      customForecastIndicatorList: mockDatabaseStore.customForecastIndicatorList,
    };
  },
  postCustomForecastIndicator: (data) => {
    const newCustomForecastIndicator = {
      ...data,
      id: Math.random().toString(36),
      sourceIndicatorIds: [],
    };
    mockDatabaseStore.customForecastIndicatorList = [
      ...mockDatabaseStore.customForecastIndicatorList,
      newCustomForecastIndicator,
    ];
  },
};

export const resetMockDB = () => {
  mockDatabaseStore = initStore();
};
