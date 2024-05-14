import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCustomForecastIndicatorPort } from '../../../port/persistence/custom-forecast-indicator/create-custom-forecast-indicator.port';
import { CreateCustomForecastIndicatorCommand } from './create-custom-forecast-indicator.command';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { Transactional } from 'typeorm-transactional';
import { IndicatorDtoType } from 'src/utils/type/type-definition';
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

    const customForecastIndicator: CustomForecastIndicator = CustomForecastIndicator.createNew(
      customForecastIndicatorName,
      targetIndicator,
    );

    return await this.createCustomForecastIndicatorPort.createCustomForecastIndicator(
      customForecastIndicator,
      memberId,
    );
  }
}
