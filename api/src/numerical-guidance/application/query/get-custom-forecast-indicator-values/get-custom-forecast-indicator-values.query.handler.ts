import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomForecastIndicatorValuesQuery } from './get-custom-forecast-indicator-values.query';
import { LoadCustomForecastIndicatorValuesPort } from '../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator-values.port';
import { CustomForecastIndicatorValues } from 'src/utils/type/type-definition';

@Injectable()
@QueryHandler(GetCustomForecastIndicatorValuesQuery)
export class GetCustomForecastIndicatorValuesQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadCustomForecastIndicatorValuesPort')
    private readonly loadCustomForecastIndicatorValuesPort: LoadCustomForecastIndicatorValuesPort,
  ) {}

  async execute(query: GetCustomForecastIndicatorValuesQuery): Promise<CustomForecastIndicatorValues> {
    const customForecastIndicatorId = query.customForecastIndicatorId;
    const customerFroecastIndicatorValues: CustomForecastIndicatorValues =
      await this.loadCustomForecastIndicatorValuesPort.loadCustomForecastIndicatorValues(customForecastIndicatorId);

    return customerFroecastIndicatorValues;
  }
}
