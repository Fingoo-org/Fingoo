import { MajorIndicatorResponse } from '@/app/store/querys/numerical-guidance/major-indicator.query';
import { mockDatabaseStore } from '.';

export type MockMajorIndicatorAction = {
  getMajorChartWithCountry: (country: string) => MajorIndicatorResponse[] | undefined;
};

export const mockMajorIndicatorAction: MockMajorIndicatorAction = {
  getMajorChartWithCountry: (country) => {
    return mockDatabaseStore.majorIndicator.filter((major) => major.country === country);
  },
};
