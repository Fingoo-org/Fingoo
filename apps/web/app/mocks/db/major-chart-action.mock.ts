import { MajorChartResponse } from '@/app/store/querys/mobile/major-chart.query';
import { mockDatabaseStore } from '.';

export type MockMajorChartAction = {
  getMajorChart: (country: string) => MajorChartResponse | undefined;
};

export const mockMajorChartAction: MockMajorChartAction = {
  getMajorChart: (country) => {
    return mockDatabaseStore.majorCountry.find((major) => major.country === country);
  },
};
