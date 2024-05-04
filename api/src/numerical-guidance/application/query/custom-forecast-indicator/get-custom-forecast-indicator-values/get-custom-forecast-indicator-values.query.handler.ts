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
import { LoadLiveIndicatorPort } from '../../../port/external/twelve/load-live-indicator.port';

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

    const targetIndicatorInformation = customForecastIndicator.targetIndicatorInformation;
    const targetIndicatorId = targetIndicatorInformation.targetIndicatorId;
    const interval = 'day';
    const endDate = this.getEndDate();
    const startDate = this.getStartDate();
    const tempType: IndicatorType = targetIndicatorInformation.indicatorType;

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(targetIndicatorId, tempType);

    const targetIndicator: LiveIndicatorDtoType = await this.loadLiveIndicatorPort.loadLiveIndicator(
      indicatorDto,
      interval,
      startDate,
      endDate,
    );

    const targetIndicatorValues: IndicatorValue[] = targetIndicator.values;

    const customForecastIndicatorValuesResponse: CustomForecastIndicatorValuesResponse = {
      customForecastIndicatorId: customForecastIndicatorId,
      targetIndicatorId: targetIndicatorId,
      type: indicatorDto.indicatorType,
      ticker: indicatorDto.symbol,
      name: this.getIndicatorNameByType(indicatorDto),
      exchange: this.getExchangeByType(indicatorDto),
      forecastType: customFroecastIndicatorValues.forecastType,
      customForecastIndicatorValues: customFroecastIndicatorValues.indicatorValues,
      targetIndicatorValues: targetIndicatorValues,
    };
    console.log(customForecastIndicatorValuesResponse);
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

  private getEndDate(): string {
    const currentDate = new Date();
    return this.formatDateToString(currentDate);
  }

  private getStartDate(): string {
    const startDate: Date = new Date();
    startDate.setDate(startDate.getDate() - 15);
    return this.formatDateToString(startDate);
  }

  private formatDateToString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
