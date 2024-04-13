import { Injectable, Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomForecastIndicatorValuesQuery } from './get-custom-forecast-indicator-values.query';
import { LoadCustomForecastIndicatorValuesPort } from '../../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator-values.port';
import {
  CustomForecastIndicatorValuesResponse,
  IndicatorValue,
  forecastApiResponse,
} from 'src/utils/type/type-definition';
import { LoadCustomForecastIndicatorPort } from '../../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';
import { LiveKRXIndicatorDto } from '../../live-indicator/dto/live-indicator.dto';
import { LoadLiveIndicatorPort } from '../../../port/external/krx/load-live-indicator.port';

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
    const customerFroecastIndicatorValues: forecastApiResponse =
      await this.loadCustomForecastIndicatorValuesPort.loadCustomForecastIndicatorValues(customForecastIndicatorId);

    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(customForecastIndicatorId);

    const targetIndicatorId = customForecastIndicator.targetIndicatorId;
    const interval = 'day';

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(targetIndicatorId);
    const { ticker, market, name, type } = indicatorDto.indicator;

    const targetIndicator: LiveKRXIndicatorDto = await this.loadLiveIndicatorPort.loadLiveIndicator(
      targetIndicatorId,
      ticker,
      interval,
      market,
    );

    const targetIndicatorValues: IndicatorValue[] = targetIndicator.values;

    const customForecastIndicatorValuesResponse: CustomForecastIndicatorValuesResponse = {
      customForecastIndicatorId: customForecastIndicatorId,
      targetIndicatorId: targetIndicatorId,
      type: type,
      ticker: ticker,
      name: name,
      market: market,
      forecastType: customerFroecastIndicatorValues.forecastType,
      customForecastIndicatorValues: customerFroecastIndicatorValues.indicatorValues,
      targetIndicatorValues: targetIndicatorValues,
    };

    return customForecastIndicatorValuesResponse;
  }
}
