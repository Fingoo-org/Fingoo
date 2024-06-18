import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomForecastIndicatorValuesQuery } from './get-custom-forecast-indicator-values.query';
import { LoadCustomForecastIndicatorValuesPort } from '../../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator-values.port';
import {
  CustomForecastIndicatorValuesResponse,
  ForecastApiResponse,
  IndicatorType,
} from 'src/utils/type/type-definition';
import { LoadCustomForecastIndicatorPort } from '../../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';

@Injectable()
@QueryHandler(GetCustomForecastIndicatorValuesQuery)
export class GetCustomForecastIndicatorValuesQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadCustomForecastIndicatorValuesPort')
    private readonly loadCustomForecastIndicatorValuesPort: LoadCustomForecastIndicatorValuesPort,
    @Inject('LoadCustomForecastIndicatorPort')
    private readonly loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  async execute(query: GetCustomForecastIndicatorValuesQuery): Promise<CustomForecastIndicatorValuesResponse> {
    const customForecastIndicatorId = query.customForecastIndicatorId;
    const customFroecastIndicatorValues: ForecastApiResponse =
      await this.loadCustomForecastIndicatorValuesPort.loadCustomForecastIndicatorValues(customForecastIndicatorId);

    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(customForecastIndicatorId);

    const targetIndicatorInformation = customForecastIndicator.targetIndicator;
    const targetIndicatorId = targetIndicatorInformation.id;
    const tempType: IndicatorType = targetIndicatorInformation.indicatorType;

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(targetIndicatorId, tempType);

    // 니놈이 문제구나

    const customForecastIndicatorValuesResponse: CustomForecastIndicatorValuesResponse = {
      customForecastIndicatorId: customForecastIndicatorId,
      targetIndicatorId: targetIndicatorId,
      type: indicatorDto.indicatorType,
      ticker: indicatorDto.symbol,
      name: this.getIndicatorNameByType(indicatorDto),
      exchange: this.getExchangeByType(indicatorDto),
      forecastType: customFroecastIndicatorValues.forecastType,
      customForecastIndicatorValues: customFroecastIndicatorValues.indicatorValues,
    };
    return customForecastIndicatorValuesResponse;
  }

  private getIndicatorNameByType(indicatorDto: any): string {
    if (indicatorDto.type == 'forex_pairs' || indicatorDto.type == 'cryptocurrencies') {
      return 'currency_base';
    }
    return indicatorDto.name;
  }

  private getExchangeByType(indicatorDto: any): string {
    if (indicatorDto.type == 'forex_pairs' || indicatorDto.type == 'cryptocurrencies') {
      return '거래소 X';
    }
    return indicatorDto.exchange;
  }
}
