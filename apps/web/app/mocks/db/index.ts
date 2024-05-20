import { IndicatorValueResponse } from '../../store/querys/numerical-guidance/indicator.query';
import {
  IndicatorByTypeResponse,
  IndicatorInfoResponse,
} from '@/app/store/querys/numerical-guidance/indicator-list.query';
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
  indicators: IndicatorByTypeResponse[];
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
      indicatorInfos: [],
      customForecastIndicatorIds: [],
      sections: {
        section1: [],
      },
    },
    {
      id: '2',
      indicatorBoardMetadataName: 'metadata2',
      indicatorInfos: [],
      customForecastIndicatorIds: [],
      sections: {
        section1: [],
      },
    },
    {
      id: '3',
      indicatorBoardMetadataName: 'metadata3',
      indicatorInfos: [],
      customForecastIndicatorIds: [],
      sections: {
        section1: [],
      },
    },
  ],
  indicators: [
    {
      symbol: 'AAPL',
      id: '1',
      indicatorType: 'stocks',
      name: 'Apple Inc.',
      country: 'United States',
      currency: 'USD',
      exchange: 'NYSE',
      mic_code: 'XNYS',
      type: 'Common Stock',
    },
    {
      symbol: 'MSFT',
      id: '2',
      indicatorType: 'stocks',
      name: 'Microsoft Corporation',
      country: 'United States',
      currency: 'USD',
      exchange: 'NYSE',
      mic_code: 'XNYS',
      type: 'Common Stock',
    },
    {
      symbol: 'GOOG',
      id: '3',
      indicatorType: 'stocks',
      name: 'Alphabet Inc.',
      country: 'United States',
      currency: 'USD',
      exchange: 'NYSE',
      mic_code: 'XNYS',
      type: 'Common Stock',
    },
    {
      symbol: '삼성전자',
      id: '9785ba85-c924-4269-8238-e1f10b404177',
      indicatorType: 'stocks',
      name: '삼성전자',
      country: 'United States',
      currency: 'USD',
      exchange: 'NYSE',
      mic_code: 'XNYS',
      type: 'Common Stock',
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
      targetIndicator: {
        symbol: 'AAPL',
        id: '1',
        indicatorType: 'stocks',
        name: '애플',
        country: 'United States',
        currency: 'USD',
        exchange: 'NYSE',
        mic_code: 'XNYS',
        type: 'Common Stock',
      },
      sourceIndicatorsInformation: [
        {
          sourceIndicatorId: '3',
          weight: 10,
          indicatorType: 'stocks',
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
      sourceIndicators: [
        {
          symbol: 'GOOG',
          id: '3',
          indicatorType: 'stocks',
          name: '구글',
          country: 'United States',
          currency: 'USD',
          exchange: 'NYSE',
          mic_code: 'XNYS',
          type: 'Common Stock',
        },
      ],
    },
    {
      id: '12',
      customForecastIndicatorName: 'customForecastIndicator2',
      targetIndicator: {
        symbol: 'MSFT',
        id: '2',
        indicatorType: 'stocks',
        name: '마이크로소프트',
        country: 'United States',
        currency: 'USD',
        exchange: 'NYSE',
        mic_code: 'XNYS',
        type: 'Common Stock',
      },
      sourceIndicatorsInformation: [
        {
          sourceIndicatorId: '1',
          weight: 20,
          indicatorType: 'stocks',
        },
        {
          sourceIndicatorId: '3',
          weight: 30,
          indicatorType: 'stocks',
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
      sourceIndicators: [
        {
          symbol: 'AAPL',
          id: '1',
          indicatorType: 'stocks',
          name: '애플',
          country: 'United States',
          currency: 'USD',
          exchange: 'NYSE',
          mic_code: 'XNYS',
          type: 'Common Stock',
        },
        {
          symbol: 'GOOG',
          id: '3',
          indicatorType: 'stocks',
          name: '구글',
          country: 'United States',
          currency: 'USD',
          exchange: 'NYSE',
          mic_code: 'XNYS',

          type: 'Common Stock',
        },
      ],
    },
    {
      id: '13',
      customForecastIndicatorName: 'customForecastIndicator3',
      targetIndicator: {
        symbol: 'GOOG',
        id: '3',
        indicatorType: 'stocks',
        name: '구글',
        country: 'United States',
        currency: 'USD',
        exchange: 'NYSE',
        mic_code: 'XNYS',
        type: 'Common Stock',
      },
      sourceIndicatorsInformation: [
        {
          sourceIndicatorId: '1',
          weight: 10,
          indicatorType: 'stocks',
        },
        {
          sourceIndicatorId: '2',
          weight: 20,
          indicatorType: 'stocks',
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
      sourceIndicators: [
        {
          symbol: 'AAPL',
          id: '1',
          indicatorType: 'stocks',
          name: '애플',
          country: 'United States',
          currency: 'USD',
          exchange: 'NYSE',
          mic_code: 'XNYS',

          type: 'Common Stock',
        },
        {
          symbol: 'MSFT',
          id: '2',
          indicatorType: 'stocks',
          name: '마이크로소프트',
          country: 'United States',
          currency: 'USD',
          exchange: 'NYSE',
          mic_code: 'XNYS',
          type: 'Common Stock',
        },
      ],
    },
    {
      id: '14',
      customForecastIndicatorName: '삼성전자 예측 지표',
      targetIndicator: {
        symbol: '삼성전자',
        id: '9785ba85-c924-4269-8238-e1f10b404177',
        indicatorType: 'stocks',
        name: '삼성전자',
        country: 'United States',
        currency: 'USD',
        exchange: 'NYSE',
        mic_code: 'XNYS',
        type: 'Common Stock',
      },
      sourceIndicatorsInformation: [
        {
          sourceIndicatorId: '1',
          weight: 10,
          indicatorType: 'stocks',
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
      sourceIndicators: [
        {
          symbol: 'AAPL',
          id: '1',
          indicatorType: 'stocks',
          name: '애플',
          country: 'United States',
          currency: 'USD',
          exchange: 'NYSE',
          mic_code: 'XNYS',
          type: 'Common Stock',
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
