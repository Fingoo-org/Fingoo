import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMajorChartQuery } from './get-major-chart.query';
import { LoadMajorChartPort } from '../../port/persistence/major-chart/load-major-chart.port';
import { MajorChart } from 'src/numerical-guidance/domain/major-chart';

@Injectable()
@QueryHandler(GetMajorChartQuery)
export class GetMajorChartQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadMajorChartPort')
    private readonly loadMajorChartPort: LoadMajorChartPort,
  ) {}

  async execute(query: GetMajorChartQuery): Promise<MajorChart> {
    const { country } = query;
    const majorChart = await this.loadMajorChartPort.loadMajorChart(country);
    return majorChart;
  }
}
