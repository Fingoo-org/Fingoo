import { Inject, Injectable } from '@nestjs/common';
import { LoadLiveMajorChartIndicator } from '../../../../../numerical-guidance/application/port/external/twelve/load-live-major-chart-indicator.port';
import { LoadMajorChartPort } from '../../../../../numerical-guidance/application/port/persistence/major-chart/load-major-chart.port';
import { MajorChart } from '../../../../../numerical-guidance/domain/major-chart';

@Injectable()
export class MajorChartPersistentAdapter implements LoadMajorChartPort {
  constructor(
    @Inject('LoadLiveMajorChartIndicator')
    private readonly loadMajorChartPort: LoadLiveMajorChartIndicator,
  ) {}

  loadMajorChart(country: string): Promise<MajorChart[]> {
    return Promise.all(this.getSymbols(country).map((symbol) => this.loadMajorChartPort.loadMajorChart(symbol, 'min')));
  }

  private getSymbols(country: string): string[] {
    switch (country) {
      case 'US':
        return ['DJI', 'SPX', 'IXIC'];
    }
  }
}
