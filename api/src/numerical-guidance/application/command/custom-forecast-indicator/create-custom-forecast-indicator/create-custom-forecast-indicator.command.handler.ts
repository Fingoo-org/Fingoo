import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomForecastIndicatorPort } from '../../../port/persistence/custom-forecast-indicator/create-custom-forecast-indicator.port';
import { CreateCustomForecastIndicatorCommand } from './create-custom-forecast-indicator.command';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { Transactional } from 'typeorm-transactional';
import { IndicatorDtoType, TargetIndicatorInformation } from 'src/utils/type/type-definition';
import { LoadIndicatorPort } from 'src/numerical-guidance/application/port/persistence/indicator/load-indicator.port';

@Injectable()
@CommandHandler(CreateCustomForecastIndicatorCommand)
export class CreateCustomForecastIndicatorCommandHandler implements ICommandHandler {
  constructor(
    @Inject('CreateCustomForecastIndicatorPort')
    private readonly createCustomForecastIndicatorPort: CreateCustomForecastIndicatorPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  @Transactional()
  async execute(command: CreateCustomForecastIndicatorCommand): Promise<string> {
    const { customForecastIndicatorName, targetIndicatorId, targetIndicatorType, memberId } = command;
    const targetIndicator: IndicatorDtoType = await this.loadIndicatorPort.loadIndicator(
      targetIndicatorId,
      targetIndicatorType,
    );

    const targetIndicatorName: string = this.getIndicatorNameByType(targetIndicator);
    const exchange: string = this.getIndicatorExchangeByType(targetIndicator);

    const targetIndicatorInformation: TargetIndicatorInformation = {
      targetIndicatorId: targetIndicatorId,
      targetIndicatorName: targetIndicatorName,
      indicatorType: targetIndicatorType,
      exchange: exchange,
      symbol: targetIndicator.symbol,
    };

    const customForecastIndicator: CustomForecastIndicator = CustomForecastIndicator.createNew(
      customForecastIndicatorName,
      targetIndicatorInformation,
    );

    return await this.createCustomForecastIndicatorPort.createCustomForecastIndicator(
      customForecastIndicator,
      memberId,
    );
  }

  private getIndicatorNameByType(indicatorDto): string {
    if (indicatorDto.type == 'cryptocurrencies' || indicatorDto.type == 'forex_pairs') {
      return indicatorDto.currency_base;
    }
    return indicatorDto.name;
  }

  private getIndicatorExchangeByType(indicatorDto): string {
    if (indicatorDto.type == 'cryptocurrencies') {
      return indicatorDto.currency_base;
    } else if (indicatorDto.type == 'forex_pairs') {
      return indicatorDto.currency_group;
    } else {
      return indicatorDto.exchange;
    }
  }
}
