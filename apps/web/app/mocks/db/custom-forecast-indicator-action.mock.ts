import {
  CustomForecastIndicatorListResponse,
  CreateCustomForecastIndicatorRequestBody,
  updateSourceIndicatorRequestBody,
  CreateCustomForecastIndicatorResponse,
  CustomForecastIndicatorValueResponse,
  CustomForecastIndicatorResponse,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { mockDatabaseStore, mockDB } from '.';
import { customForecastIndicatorMockData } from '../mock-data/custom-indicator-value.mock';

export type MockCustomForecastIndicatorAction = {
  getCustomForecastIndicatorList: () => CustomForecastIndicatorListResponse;
  postCustomForecastIndicator: (
    data: CreateCustomForecastIndicatorRequestBody,
  ) => CreateCustomForecastIndicatorResponse;
  patchSourceIndicator: (id: string, data: updateSourceIndicatorRequestBody) => void;
  deleteCustomForecastIndicator: (id: string) => void;
  updateCustomForecastIndicatorName: (id: string, name: string) => void;
  getCustomForecastIndicatorValue: (id: string) => CustomForecastIndicatorValueResponse | undefined;
};

export const mockCustomForecastIndicatorAction: MockCustomForecastIndicatorAction = {
  getCustomForecastIndicatorList: () => {
    return mockDatabaseStore.customForecastIndicatorList;
  },
  postCustomForecastIndicator: (data) => {
    const id = Math.random().toString(36);
    const newCustomForecastIndicator = {
      customForecastIndicatorName: data.customForecastIndicatorName,
      targetIndicator: {
        symbol: 'Mock',
        id: data.targetIndicatorId,
        indicatorType: 'stocks',
        name: '가짜 주식',
        country: 'United States',
        currency: 'USD',
        exchange: 'NYSE',
        mic_code: 'XNYS',
        index: 1,
        type: 'Common Stock',
      },
      id,
      sourceIndicatorsInformation: [],
      grangerVerification: [],
      cointJohansenVerification: [],
      type: 'customForecastIndicator',
      sourceIndicators: [],
    } as CustomForecastIndicatorResponse;

    mockDatabaseStore.customForecastIndicatorList = [
      ...mockDatabaseStore.customForecastIndicatorList,
      newCustomForecastIndicator,
    ];

    return id;
  },
  patchSourceIndicator: (id, data) => {
    const index = mockDatabaseStore.customForecastIndicatorList.findIndex(
      (customForecastIndicator) => customForecastIndicator.id === id,
    );
    const newCustomForecastIndicator = {
      ...mockDatabaseStore.customForecastIndicatorList[index],
      sourceIndicatorIdsAndweights: [...data.sourceIndicatorsInformation],
    };
    mockDatabaseStore.customForecastIndicatorList[index] = newCustomForecastIndicator;
  },
  deleteCustomForecastIndicator: (id) => {
    mockDatabaseStore.customForecastIndicatorList = mockDatabaseStore.customForecastIndicatorList.filter(
      (customForecastIndicator) => customForecastIndicator.id !== id,
    );
  },
  updateCustomForecastIndicatorName: (id, name) => {
    const index = mockDatabaseStore.customForecastIndicatorList.findIndex(
      (customForecastIndicator) => customForecastIndicator.id === id,
    );
    const newCustomForecastIndicator = {
      ...mockDatabaseStore.customForecastIndicatorList[index],
      customForecastIndicatorName: name,
    };
    mockDatabaseStore.customForecastIndicatorList[index] = newCustomForecastIndicator;
  },
  getCustomForecastIndicatorValue: (id) => {
    const customForecastIndicator = mockDatabaseStore.customForecastIndicatorList.find(
      (customForecastIndicator) => customForecastIndicator.id === id,
    );
    if (!customForecastIndicator) return;

    const targetIndicator = mockDatabaseStore.indicatorList.find(
      (indicator) => indicator.id === customForecastIndicator.targetIndicator.id,
    );

    if (!targetIndicator) return;

    const targetIndicatorValue = mockDB.getIndicatorValue(targetIndicator.id!);

    const customForecastIndicatorValue = customForecastIndicatorMockData.find(
      (customForecastIndicator) => customForecastIndicator.id === id,
    );

    if (!customForecastIndicatorValue || !targetIndicatorValue) return;

    return {
      customForecastIndicatorId: customForecastIndicator.id,
      targetIndicatorId: targetIndicator.id,
      name: targetIndicator.name,
      ticker: targetIndicator.ticker,
      market: 'KOSPI',
      type: 'customForecastIndicator',
      forecastType: 'multi',
      targetIndicatorValues: targetIndicatorValue.values,
      customForecastIndicatorValues: customForecastIndicatorValue.values,
    };
  },
};
