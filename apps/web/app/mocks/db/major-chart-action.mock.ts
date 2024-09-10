import { MajorChartResponse } from '@/app/store/querys/mobile/major-chart.query';
import { mockDatabaseStore } from '.';

export type MockMajorChartAction = {
  getMajorChartWithCountry: (country: string) => MajorChartResponse[] | undefined;
};

export const mockMajorChartAction: MockMajorChartAction = {
  getMajorChartWithCountry: (country) => {
    return mockDatabaseStore.majorCountry.filter((major) => major.country === country);
  },
};
