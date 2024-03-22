import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UpdateCustomForecastIndicatorNameCommand } from './update-custom-forecast-indicator-name.command';
import { UpdateCustomForecastIndicatorNamePort } from '../../port/persistence/custom-forecast-indicator/update-custom-forecast-indicator-name.port';
import { LoadCustomForecastIndicatorPort } from '../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

@Injectable()
@CommandHandler(UpdateCustomForecastIndicatorNameCommand)
export class UpdateCustomForecastIndicatorNameCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UpdateCustomForecastIndicatorNamePort')
    private readonly updateCustomForecastIndicatorNamePort: UpdateCustomForecastIndicatorNamePort,
    @Inject('LoadCustomForecastIndicatorPort')
    private readonly loadCustomForecastIndicatorPort: LoadCustomForecastIndicatorPort,
  ) {}

  @Transactional()
  async execute(command: UpdateCustomForecastIndicatorNameCommand) {
    const { id, name } = command;
    const customForecastIndicator: CustomForecastIndicator =
      await this.loadCustomForecastIndicatorPort.loadCustomForecastIndicator(id);

    customForecastIndicator.updateCustomForecastIndicatorName(name);

    await this.updateCustomForecastIndicatorNamePort.updateCustomForecastIndicatorName(customForecastIndicator);
  }
}
