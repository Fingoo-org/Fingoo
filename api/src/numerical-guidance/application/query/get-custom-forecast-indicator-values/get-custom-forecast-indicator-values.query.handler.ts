import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomForecastIndicatorValuesQuery } from './get-custom-forecast-indicator-values.query';
import { LoadCustomForecastIndicatorValuesPort } from '../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator-values.port';
import {
  CustomForecastIndicatorValues,
  CustomForecastIndicatorValuesResponse,
  TargetIndicatorsValues,
} from 'src/utils/type/type-definition';
import { LoadCustomForecastIndicatorPort } from '../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { LoadLiveIndicatorPort } from '../../port/external/load-live-indicator.port';
import { LoadIndicatorPort } from '../../port/persistence/indicator/load-indicator.port';
import { LiveIndicatorDto } from '../get-live-indicator/live-indicator.dto';

@Injectable()
@QueryHandler(GetCustomForecastIndicatorValuesQuery)
export class GetCustomForecastIndicatorValuesQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadCustomForecastIndicatorValuesPort')
    private readonly loadCustomForecastIndicatorValuesPort: LoadCustomForecastIndicatorValuesPort,
    @Inject('LoadCustomForecastIndicatorPort')
    private readonly loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort,
    @Inject('LoadLiveIndicatorPort')
    private readonly loadLiveIndicatorPort: LoadLiveIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  async execute(query: GetCustomForecastIndicatorValuesQuery): Promise<CustomForecastIndicatorValuesResponse> {
    const customForecastIndicatorId = query.customForecastIndicatorId;
    const customerFroecastIndicatorValues: CustomForecastIndicatorValues =
      await this.loadCustomForecastIndicatorValuesPort.loadCustomForecastIndicatorValues(customForecastIndicatorId);

    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(customForecastIndicatorId);

    const targetIndicatorId = customForecastIndicator.targetIndicatorId;
    const interval = 'day';

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(targetIndicatorId);
    const { ticker, market, name } = indicatorDto.indicator;

    const targetIndicator: LiveIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(
      targetIndicatorId,
      ticker,
      interval,
      market,
    );

    const targetIndicatorValues: TargetIndicatorsValues = {
      name: name,
      values: targetIndicator.values,
    };

    const customForecastIndicatorValuesResponse: CustomForecastIndicatorValuesResponse = {
      customForecastIndicatorValues: customerFroecastIndicatorValues,
      targetIndicatorValues: targetIndicatorValues,
    };

    return customForecastIndicatorValuesResponse;
  }
}
