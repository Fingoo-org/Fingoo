import { Transactional } from 'typeorm-transactional';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { DeleteIndicatorIdCommand } from './delete-indicator-id.command';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteIndicatorIdPort } from '../../port/persistence/indicator-board-metadata/delete-indicator-id.port';

@Injectable()
@CommandHandler(DeleteIndicatorIdCommand)
export class DeleteIndicatorIdCommandHandler implements ICommandHandler {
  constructor(
    @Inject('DeleteIndicatorIdPort')
    private readonly deleteIndicatorIdPort: DeleteIndicatorIdPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: DeleteIndicatorIdCommand) {
    const { indicatorBoardMetadataId, indicatorId } = command;
    const indicatorBoardMetaData: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetaData(indicatorBoardMetadataId);

    indicatorBoardMetaData.deleteIndicatorId(indicatorId);

    await this.deleteIndicatorIdPort.deleteIndicatorId(indicatorBoardMetaData);
  }
}
