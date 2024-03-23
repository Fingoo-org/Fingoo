import { Transactional } from 'typeorm-transactional';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCustomForecastIndicatorIdCommand } from './delete-custom-forecast-indicator-id.command';
import { DeleteCustomForecastIndicatorIdPort } from '../../port/persistence/indicator-board-metadata/delete-custom-forecast-indicator-id.port';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';

@Injectable()
@CommandHandler(DeleteCustomForecastIndicatorIdCommand)
export class DeleteCustomForecastIndicatorIdCommandHandler implements ICommandHandler {
  constructor(
    @Inject('DeleteCustomForecastIndicatorIdPort')
    private readonly deleteCustomForecastIndicatorIdPort: DeleteCustomForecastIndicatorIdPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: DeleteCustomForecastIndicatorIdCommand) {
    const { indicatorBoardMetadataId, customForecastIndicatorId } = command;
    const indicatorBoardMetadata: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata(indicatorBoardMetadataId);
    indicatorBoardMetadata.deleteCustomForecastIndicatorId(customForecastIndicatorId);

    await this.deleteCustomForecastIndicatorIdPort.deleteCustomForecastIndicatorId(indicatorBoardMetadata);
  }
}
