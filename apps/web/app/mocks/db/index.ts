import { IndicatorValueResponse } from '../../store/querys/numerical-guidance/indicator-value.query';
import { IndicatorByTypeResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
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
import { IndicatorQuoteResponse } from '@/app/store/querys/mobile/indicator-quote.query';
import { mockIndicatorQuoteAction, MockIndicatorQuoteAction } from './indicator-quote.action.mock';

type MockDatabase = {
  metadataList: IndicatorBoardMetadataResponse[];
  indicators: IndicatorByTypeResponse[];
  indicatorsValue: IndicatorValueResponse[];
  historyIndicatorsValue: historyIndicatorsValueMockData;
  customForecastIndicatorList: CustomForecastIndicatorListResponse;
  indicatorQuoteResponse: IndicatorQuoteResponse[];
};

type MockDatabaseAction = MockCustomForecastIndicatorAction &
  MockIndicatorBoardMetadataAction &
  MockIndicatorAction &
  MockIndicatorQuoteAction;

export const mockDB: MockDatabaseAction = {
  ...mockIndicatorBoardMetadataAction,
  ...mockIndicatorAction,
  ...mockCustomForecastIndicatorAction,
  ...mockIndicatorQuoteAction,
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
      symbol: '005930',
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
  indicatorQuoteResponse: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc',
      exchange: 'NASDAQ',
      micCode: 'XNGS',
      currency: 'USD',
      datetime: '2024-08-30',
      timestamp: 1725024600,
      open: '230.19000',
      high: '230.39999',
      low: '227.48000',
      close: '229.00000',
      volume: '52958500',
      previousClose: '229.78999',
      change: '-0.78999',
      percentChange: '-0.34379',
      averageVolume: '39757870',
      isMarketOpen: false,
      fiftyTwoWeek: {
        low: '164.08000',
        high: '237.23000',
        lowChange: '64.92000',
        highChange: '-8.23000',
        lowChangePercent: '39.56606',
        highChangePercent: '-3.46921',
        range: '164.080002 - 237.229996',
      },
    },
    {
      symbol: 'EUR/USD',
      name: 'Euro / US Dollar',
      exchange: 'Forex',
      datetime: '2024-09-03',
      timestamp: 1725332767,
      open: '1.10690',
      high: '1.10762',
      low: '1.10586',
      close: '1.10613',
      previousClose: '1.10730',
      change: '-0.00117',
      percentChange: '-0.10593',
      isMarketOpen: true,
      fiftyTwoWeek: {
        low: '1.04480',
        high: '1.12020',
        lowChange: '0.06133',
        highChange: '-0.01407',
        lowChangePercent: '5.86973',
        highChangePercent: '-1.25629',
        range: '1.044800 - 1.120200',
      },
      micCode: 'ABCD',
      currency: 'USD',
      volume: '1234567',
      averageVolume: '1234123',
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
