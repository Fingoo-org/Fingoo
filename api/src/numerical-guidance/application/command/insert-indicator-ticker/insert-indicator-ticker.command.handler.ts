import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { InsertIndicatorTickerPort } from '../../port/persistence/insert-indicator-ticker.port';
import { Transactional } from 'typeorm-transactional';
import { InsertIndicatorTickerCommand } from './insert-indicator-ticker.command';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

@Injectable()
@CommandHandler(InsertIndicatorTickerCommand)
export class InsertIndicatorTickerCommandHandler implements ICommandHandler {
  constructor(
    @Inject('InsertIndicatorTickerPort')
    private readonly insertIndicatorTickerPort: InsertIndicatorTickerPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: InsertIndicatorTickerCommand) {
    const { id, ticker, type } = command;
    const indicatorBoardMetaData: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetaData(id);

    indicatorBoardMetaData.insertIndicatorTicker(ticker, type);

    await this.insertIndicatorTickerPort.addIndicatorTicker(indicatorBoardMetaData);
  }
}
