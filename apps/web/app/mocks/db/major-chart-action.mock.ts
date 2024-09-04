import { MajorChartResponse } from '@/app/store/querys/mobile/major-chart.query';
import { mockDatabaseStore } from '.';

export type MockMajorChartAction = {
  getMajorChart: () => MajorChartResponse[] | undefined;
};

export const mockMajorChartAction: MockMajorChartAction = {
  getMajorChart: () => {
    return mockDatabaseStore.majorCountry;
  },
};
