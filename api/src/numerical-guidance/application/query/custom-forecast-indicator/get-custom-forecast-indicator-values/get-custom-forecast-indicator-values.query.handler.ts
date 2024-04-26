import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomForecastIndicatorValuesQuery } from './get-custom-forecast-indicator-values.query';
import { LoadCustomForecastIndicatorValuesPort } from '../../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator-values.port';
import {
  CustomForecastIndicatorValuesResponse,
  ForecastApiResponse,
  IndicatorType,
  IndicatorValue,
  LiveIndicatorDtoType,
} from 'src/utils/type/type-definition';
import { LoadCustomForecastIndicatorPort } from '../../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';
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
    const customFroecastIndicatorValues: ForecastApiResponse =
      await this.loadCustomForecastIndicatorValuesPort.loadCustomForecastIndicatorValues(customForecastIndicatorId);

    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(customForecastIndicatorId);

    const targetIndicatorId = customForecastIndicator.targetIndicatorId;
    const interval = 'day';
    const tempType: IndicatorType = 'stocks'; // TODO: 임시 타입

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(targetIndicatorId, tempType);

    const targetIndicator: LiveIndicatorDtoType = await this.loadLiveIndicatorPort.loadLiveIndicator(
      indicatorDto,
      interval,
      'rowStartDate',
      'rowEndDate',
    );

    const targetIndicatorValues: IndicatorValue[] = targetIndicator.values;

    const customForecastIndicatorValuesResponse: CustomForecastIndicatorValuesResponse = {
      customForecastIndicatorId: customForecastIndicatorId,
      targetIndicatorId: targetIndicatorId,
      type: indicatorDto.indicatorType,
      ticker: indicatorDto.symbol,
      name: this.getIndicatorNameByType(indicatorDto),
      exchange: this.getMarketByType(indicatorDto),
      forecastType: customFroecastIndicatorValues.forecastType,
      customForecastIndicatorValues: customFroecastIndicatorValues.indicatorValues,
      targetIndicatorValues: targetIndicatorValues,
    };

    return customForecastIndicatorValuesResponse;
  }

  // TODO: 요구사항에 맞게 변경
  private getIndicatorNameByType(indicatorDto): string {
    if (indicatorDto.type == 'cryptocurrencies') {
      return indicatorDto.symbol;
    }
    return indicatorDto.name;
  }

  // TODO: 요구사항에 맞게 변경
  private getMarketByType(indicatorDto): string {
    if (indicatorDto.type == 'forex_pairs' || indicatorDto.type == 'cryptocurrencies') {
      return '거래소 X';
    }
    return indicatorDto.exchange;
  }
}
