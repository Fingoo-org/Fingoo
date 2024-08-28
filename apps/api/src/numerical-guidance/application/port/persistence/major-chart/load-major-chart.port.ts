import { MajorChart } from '../../../../../numerical-guidance/domain/major-chart';

export interface LoadMajorChartPort {
  loadMajorChart(country: string): Promise<MajorChart>;
}
