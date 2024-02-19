import { Transactional } from 'typeorm-transactional';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/load-indiactor-board-metadata.port';
import { DeleteIndicatorTickerCommand } from './delete-indicator-ticker.command';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteIndicatorTickerPort } from '../../port/persistence/delete-indicator-ticker.port';

@Injectable()
@CommandHandler(DeleteIndicatorTickerCommand)
export class DeleteIndicatorTickerCommandHandler implements ICommandHandler {
  constructor(
    @Inject('DeleteIndicatorTickerPort')
    private readonly deleteIndicatorTickerPort: DeleteIndicatorTickerPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: DeleteIndicatorTickerCommand) {
    const { indicatorBoardMetaDataId, ticker } = command;
    const indicatorBoardMetaData: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetaData(indicatorBoardMetaDataId);

    indicatorBoardMetaData.deleteIndicatorTicker(ticker);

    await this.deleteIndicatorTickerPort.deleteIndicatorTicker(indicatorBoardMetaData);
  }
}
