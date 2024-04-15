import { IndicatorInfoResponse, IndicatorValueResponse } from '../../store/querys/numerical-guidance/indicator.query';
import { IndicatorBoardMetadataResponse } from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { indicatorsValueMockData } from '../mock-data/indicators-value.mock';
import { CustomForecastIndicatorListResponse } from '../../store/querys/numerical-guidance/custom-forecast-indicator.query';
import { historyIndicatorsValueMockData } from '../mock-data/history-indicators-value.mock';
import {
  MockIndicatorBoardMetadataAction,
  mockIndicatorBoardMetadataAction,
} from './indicator-board-metadata-action.mock';
import { MockIndicatorAction, mockIndicatorAction } from './indicator-action.mock';
import {
  MockCustomForecastIndicatorAction,
  mockCustomForecastIndicatorAction,
} from './custom-forecast-indicator-action.mock';

type MockDatabase = {
  metadataList: IndicatorBoardMetadataResponse[];
  indicatorList: IndicatorInfoResponse[];
  indicatorsValue: IndicatorValueResponse[];
  historyIndicatorsValue: historyIndicatorsValueMockData;
  customForecastIndicatorList: CustomForecastIndicatorListResponse;
};

type MockDatabaseAction = MockCustomForecastIndicatorAction & MockIndicatorBoardMetadataAction & MockIndicatorAction;

export const mockDB: MockDatabaseAction = {
  ...mockIndicatorBoardMetadataAction,
  ...mockIndicatorAction,
  ...mockCustomForecastIndicatorAction,
};

const initialState: MockDatabase = {
  metadataList: [
    {
      id: '1',
      indicatorBoardMetadataName: 'metadata1',
      indicatorIds: [],
      customForecastIndicatorIds: [],
      sections: {
        section1: [],
      },
    },
    {
      id: '2',
      indicatorBoardMetadataName: 'metadata2',
      indicatorIds: [],
      customForecastIndicatorIds: [],
      sections: {
        section1: [],
      },
    },
    {
      id: '3',
      indicatorBoardMetadataName: 'metadata3',
      indicatorIds: [],
      customForecastIndicatorIds: [],
      sections: {
        section1: [],
      },
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
      id: '11',
      customForecastIndicatorName: 'customForecastIndicator1',
      targetIndicatorId: '1',
      sourceIndicatorIdsAndWeights: [
        {
          sourceIndicatorId: '3',
          weight: 10,
        },
      ],
      type: 'customForecastIndicator',
      grangerVerification: [
        {
          indicatorId: '1',
          verification: 'True',
        },
        {
          indicatorId: '3',
          verification: 'True',
        },
      ],
      cointJohansenVerification: [
        {
          indicatorId: '1',
          verification: 'True',
        },
        {
          indicatorId: '3',
          verification: 'True',
        },
      ],
    },
    {
      id: '12',
      customForecastIndicatorName: 'customForecastIndicator2',
      targetIndicatorId: '2',
      sourceIndicatorIdsAndWeights: [
        {
          sourceIndicatorId: '1',
          weight: 20,
        },
        {
          sourceIndicatorId: '3',
          weight: 30,
        },
      ],
      type: 'customForecastIndicator',
      grangerVerification: [
        {
          indicatorId: '2',
          verification: 'True',
        },
        {
          indicatorId: '1',
          verification: 'True',
        },
        {
          indicatorId: '3',
          verification: 'True',
        },
      ],
      cointJohansenVerification: [
        {
          indicatorId: '1',
          verification: 'True',
        },
        {
          indicatorId: '3',
          verification: 'True',
        },
        {
          indicatorId: '2',
          verification: 'True',
        },
      ],
    },
    {
      id: '13',
      customForecastIndicatorName: 'customForecastIndicator3',
      targetIndicatorId: '3',
      sourceIndicatorIdsAndWeights: [
        {
          sourceIndicatorId: '1',
          weight: 10,
        },
        {
          sourceIndicatorId: '2',
          weight: 20,
        },
      ],
      type: 'customForecastIndicator',
      grangerVerification: [
        {
          indicatorId: '2',
          verification: 'True',
        },
        {
          indicatorId: '1',
          verification: 'True',
        },
        {
          indicatorId: '3',
          verification: 'True',
        },
      ],
      cointJohansenVerification: [
        {
          indicatorId: '1',
          verification: 'True',
        },
        {
          indicatorId: '3',
          verification: 'True',
        },
        {
          indicatorId: '2',
          verification: 'True',
        },
      ],
    },
    {
      id: '14',
      customForecastIndicatorName: '삼성전자 예측 지표',
      targetIndicatorId: '9785ba85-c924-4269-8238-e1f10b404177',
      sourceIndicatorIdsAndWeights: [
        {
          sourceIndicatorId: '1',
          weight: 10,
        },
      ],
      type: 'customForecastIndicator',
      grangerVerification: [
        {
          indicatorId: '9785ba85-c924-4269-8238-e1f10b404177',
          verification: 'True',
        },
        {
          indicatorId: '1',
          verification: 'True',
        },
      ],
      cointJohansenVerification: [
        {
          indicatorId: '9785ba85-c924-4269-8238-e1f10b404177',
          verification: 'True',
        },
        {
          indicatorId: '1',
          verification: 'True',
        },
      ],
    },
  ],
};

// mock이라 성능상의 문제가 필요 없음으로 사용
function initStore(): MockDatabase {
  return JSON.parse(JSON.stringify(initialState));
}

export let mockDatabaseStore = initStore();

export const resetMockDB = () => {
  mockDatabaseStore = initStore();
};
