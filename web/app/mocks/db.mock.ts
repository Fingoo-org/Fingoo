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
  AddSourceIndicatorToCustomForecastIndicatorRequestBody,
  CreateCustomForecastIndicatorRequestBody,
  CustomForecastIndicatorListResponse,
} from '../store/querys/numerical-guidance/custom-forecast-indicator.query';
import { historyIndicatorsValueMockData } from './mock-data/history-indicators-value.mock';
import { HistoryIndicatorValueCursorPaginationResponse } from '../store/querys/numerical-guidance/history-indicator.query';

type MockDatabase = IndicatorBoardMetadataListResponse &
  IndicatorListResponse &
  IndicatorsValueResponse &
  CustomForecastIndicatorListResponse & {
    historyIndicatorsValue: historyIndicatorsValueMockData;
  };

type MockDatabaseAction = {
  getMetadataList: () => IndicatorBoardMetadataListResponse;
  postMetadataList: (newMetadata: CreateIndicatorMetadataRequestBody) => void;
  getIndicatorList: () => IndicatorListResponse;
  getMetadata: (id: string) => IndicatorBoardMetadataResponse | undefined;
  postIndicatorToMetadata: (id: string, data: AddIndicatorToMetadataRequestBody) => void;
  deleteIndicatorFromMetadata: (id: string, indicatorKey: string) => void;
  getIndicatorValue: (id: string) => IndicatorValueResponse | undefined;
  patchMetadata: (id: string, data: UpdateIndicatorBoardMetadataRequestBody) => void;
  deleteMetadata: (id: string) => void;
  getCustomForecastIndicatorList: () => CustomForecastIndicatorListResponse;
  postCustomForecastIndicator: (data: CreateCustomForecastIndicatorRequestBody) => void;
  postSourceIndicatorToCustomForecastIndicator: (
    id: string,
    data: AddSourceIndicatorToCustomForecastIndicatorRequestBody,
  ) => void;
  getHistoryIndicatorValue: (
    id: string,
    startDate: string,
    endDate: string,
  ) => HistoryIndicatorValueCursorPaginationResponse | undefined;
};

const initialState: MockDatabase = {
  metadataList: [
    {
      id: '1',
      name: 'metadata1',
      indicatorIds: [],
      customForecastIndicatorIds: [],
    },
    {
      id: '2',
      name: 'metadata2',
      indicatorIds: [],
      customForecastIndicatorIds: [],
    },
    {
      id: '3',
      name: 'metadata3',
      indicatorIds: [],
      customForecastIndicatorIds: [],
    },
  ],
  indicatorList: [
    {
      id: '1',
      ticker: 'AAPL',
      name: 'Apple Inc.',
    },
    {
      id: '2',
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
    },
    {
      id: '3',
      ticker: 'GOOG',
      name: 'Alphabet Inc.',
    },
    {
      id: '9785ba85-c924-4269-8238-e1f10b404177',
      name: '삼성전자',
      ticker: '005930',
    },
  ],
  indicatorsValue: indicatorsValueMockData,
  historyIndicatorsValue: historyIndicatorsValueMockData,
  customForecastIndicatorList: [
    {
      id: '1',
      name: 'customForecastIndicator1',
      targetIndicatorId: '1',
      sourceIndicatorIdsAndweights: [
        {
          id: '2',
          weight: 0.5,
        },
        {
          id: '3',
          weight: 0.5,
        },
      ],
    },
    {
      id: '2',
      name: 'customForecastIndicator2',
      targetIndicatorId: '2',
      sourceIndicatorIdsAndweights: [
        {
          id: '1',
          weight: 0.5,
        },
        {
          id: '3',
          weight: 0.5,
        },
      ],
    },
    {
      id: '3',
      name: 'customForecastIndicator3',
      targetIndicatorId: '3',
      sourceIndicatorIdsAndweights: [
        {
          id: '1',
          weight: 0.5,
        },
        {
          id: '2',
          weight: 0.5,
        },
      ],
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
  postMetadataList: (data) => {
    const newMetadata = {
      ...data,
      indicatorIds: [],
      customForecastIndicatorIds: [],
    };
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
      indicatorIds: [...mockDatabaseStore.metadataList[index].indicatorIds, data.indicatorId],
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  deleteIndicatorFromMetadata: (id, indicatorKey) => {
    const index = mockDatabaseStore.metadataList.findIndex((metadata) => metadata.id === id);
    const newMetadata = {
      ...mockDatabaseStore.metadataList[index],
      indicatorIds: mockDatabaseStore.metadataList[index].indicatorIds.filter((id) => id !== indicatorKey),
    };

    mockDatabaseStore.metadataList[index] = newMetadata;
  },
  getIndicatorValue: (id) => {
    return mockDatabaseStore.indicatorsValue.find((indicator) => indicator.id === id);
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
      sourceIndicatorIdsAndweights: [],
    };
    mockDatabaseStore.customForecastIndicatorList = [
      ...mockDatabaseStore.customForecastIndicatorList,
      newCustomForecastIndicator,
    ];
  },
  postSourceIndicatorToCustomForecastIndicator: (id, data) => {
    const index = mockDatabaseStore.customForecastIndicatorList.findIndex(
      (customForecastIndicator) => customForecastIndicator.id === id,
    );
    const newCustomForecastIndicator = {
      ...mockDatabaseStore.customForecastIndicatorList[index],
      sourceIndicatorIdsAndweights: [
        ...mockDatabaseStore.customForecastIndicatorList[index].sourceIndicatorIdsAndweights,
        ...data.sourceIndicatorsAndweights,
      ],
    };

    mockDatabaseStore.customForecastIndicatorList[index] = newCustomForecastIndicator;
  },
  getHistoryIndicatorValue: (id, startDate, endDate) => {
    const historyIndicatorValue = mockDatabaseStore.historyIndicatorsValue.find((indicator) => indicator.id === id);

    if (historyIndicatorValue === undefined) return undefined;

    return {
      ...historyIndicatorValue,
      data: {
        ...historyIndicatorValue?.data,
        values: historyIndicatorValue?.data.values.filter((value) => value.date >= startDate && value.date <= endDate),
      },
    };
  },
};

export const resetMockDB = () => {
  mockDatabaseStore = initStore();
};
