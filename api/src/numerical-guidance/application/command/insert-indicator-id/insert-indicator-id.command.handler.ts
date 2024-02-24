import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { InsertIndicatorIdPort } from '../../port/persistence/indicator-board-metadata/insert-indicator-id.port';
import { Transactional } from 'typeorm-transactional';
import { InsertIndicatorIdCommand } from './insert-indicator-id.command';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

@Injectable()
@CommandHandler(InsertIndicatorIdCommand)
export class InsertIndicatorIdCommandHandler implements ICommandHandler {
  constructor(
    @Inject('InsertIndicatorIdPort')
    private readonly insertIndicatorIdPort: InsertIndicatorIdPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: InsertIndicatorIdCommand) {
    const { indicatorBoardMetadataId, indicatorId } = command;
    const indicatorBoardMetaData: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetaData(indicatorBoardMetadataId);

    indicatorBoardMetaData.insertIndicatorId(indicatorId);

    await this.insertIndicatorIdPort.addIndicatorId(indicatorBoardMetaData);
  }
}
