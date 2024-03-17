import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { InsertCustomForecastIndicatorIdCommand } from './insert-custom-forecast-indicator-id.command';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { InsertCustomForecastIndicatorIdPort } from '../../port/persistence/indicator-board-metadata/insert-custom-forecast-indicator-id.port';

@Injectable()
@CommandHandler(InsertCustomForecastIndicatorIdCommand)
export class InsertCustomForecastIndicatorIdCommandHandler implements ICommandHandler {
  constructor(
    @Inject('InsertCustomForecastIndicatorIdPort')
    private readonly insertCustomForecastIndicatorIdPort: InsertCustomForecastIndicatorIdPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: InsertCustomForecastIndicatorIdCommand) {
    const { indicatorBoardMetadataId, customForecastIndicatorId } = command;
    const indicatorBoardMetadata: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetadata(indicatorBoardMetadataId);

    indicatorBoardMetadata.insertCustomForecastIndicatorId(customForecastIndicatorId);

    await this.insertCustomForecastIndicatorIdPort.addCustomForecastIndicatorId(indicatorBoardMetadata);
  }
}
