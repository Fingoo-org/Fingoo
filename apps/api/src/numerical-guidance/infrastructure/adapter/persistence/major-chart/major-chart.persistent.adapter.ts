import { Injectable } from '@nestjs/common';
import { LoadMajorChartPort } from 'src/numerical-guidance/application/port/persistence/major-chart/load-major-chart.port';
import { MajorChart } from 'src/numerical-guidance/domain/major-chart';

@Injectable()
export class MajorChartPersistentAdapter implements LoadMajorChartPort {
  constructor() {}

  loadMajorChart(country: string): Promise<MajorChart> {
    throw new Error(country + ' Method not implemented.');
  }
}
