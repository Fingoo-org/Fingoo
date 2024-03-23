import {
  CustomForecastIndicatorListResponse,
  CreateCustomForecastIndicatorRequestBody,
  updateSourceIndicatorRequestBody,
  CreateCustomForecastIndicatorResponse,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { mockDatabaseStore } from '.';

export type MockCustomForecastIndicatorAction = {
  getCustomForecastIndicatorList: () => CustomForecastIndicatorListResponse;
  postCustomForecastIndicator: (
    data: CreateCustomForecastIndicatorRequestBody,
  ) => CreateCustomForecastIndicatorResponse;
  patchSourceIndicator: (id: string, data: updateSourceIndicatorRequestBody) => void;
  deleteCustomForecastIndicator: (id: string) => void;
  updateCustomForecastIndicatorName: (id: string, name: string) => void;
};

export const mockCustomForecastIndicatorAction: MockCustomForecastIndicatorAction = {
  getCustomForecastIndicatorList: () => {
    return mockDatabaseStore.customForecastIndicatorList;
  },
  postCustomForecastIndicator: (data) => {
    const id = Math.random().toString(36);
    const newCustomForecastIndicator = {
      ...data,
      id,
      sourceIndicatorIdsAndWeights: [],
    };
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
      sourceIndicatorIdsAndweights: [...data.sourceIndicatorIdsAndWeights],
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
};
