import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { DeleteCustomForecastIndicatorPort } from '../../../port/persistence/custom-forecast-indicator/delete-custom-forecast-indicator.port';
import { DeleteCustomForecastIndicatorCommand } from './delete-custom-forecast-indicator.command';

@Injectable()
@CommandHandler(DeleteCustomForecastIndicatorCommand)
export class DeleteCustomForecastIndicatorCommandHandler implements ICommandHandler {
  constructor(
    @Inject('DeleteCustomForecastIndicatorPort')
    private readonly deleteCustomForecastIndicatorPort: DeleteCustomForecastIndicatorPort,
  ) {}

  @Transactional()
  async execute(command: DeleteCustomForecastIndicatorCommand): Promise<void> {
    const { id } = command;
    await this.deleteCustomForecastIndicatorPort.deleteCustomForecastIndicator(id);
  }
}
