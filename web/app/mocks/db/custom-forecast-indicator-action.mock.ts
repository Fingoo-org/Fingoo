import {
  CustomForecastIndicatorListResponse,
  CreateCustomForecastIndicatorRequestBody,
  AddSourceIndicatorToCustomForecastIndicatorRequestBody,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { mockDatabaseStore } from '.';

export type MockCustomForecastIndicatorAction = {
  getCustomForecastIndicatorList: () => CustomForecastIndicatorListResponse;
  postCustomForecastIndicator: (data: CreateCustomForecastIndicatorRequestBody) => void;
  postSourceIndicatorToCustomForecastIndicator: (
    id: string,
    data: AddSourceIndicatorToCustomForecastIndicatorRequestBody,
  ) => void;
};

export const mockCustomForecastIndicatorAction: MockCustomForecastIndicatorAction = {
  getCustomForecastIndicatorList: () => {
    return mockDatabaseStore.customForecastIndicatorList;
  },
  postCustomForecastIndicator: (data) => {
    const newCustomForecastIndicator = {
      ...data,
      id: Math.random().toString(36),
      sourceIndicatorIdsAndWeights: [],
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
        ...mockDatabaseStore.customForecastIndicatorList[index].sourceIndicatorIdsAndWeights,
        ...data.sourceIndicatorsAndweights,
      ],
    };
    mockDatabaseStore.customForecastIndicatorList[index] = newCustomForecastIndicator;
  },
};
