import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomForecastIndicatorQuery } from './get-custom-forecast-indicator.query';
import { LoadCustomForecastIndicatorPort } from '../../port/persistence/custom-forecast-indicator/laod-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

@Injectable()
@QueryHandler(GetCustomForecastIndicatorQuery)
export class GetCustomForecastIndicatorQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadCustomForecastIndicatorPort')
    private readonly loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort,
  ) {}

  async execute(getCustomForecastIndicatorQuery: GetCustomForecastIndicatorQuery): Promise<CustomForecastIndicator> {
    const customForecastIndicatorId = getCustomForecastIndicatorQuery.customForecastIndicatorId;
    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(customForecastIndicatorId);
    return customForecastIndicator;
  }
}
