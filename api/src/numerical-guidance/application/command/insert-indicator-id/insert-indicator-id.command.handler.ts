import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { InsertIndicatorIdPort } from '../../port/persistence/indicator-board-metadata/insert-indicator-id.port';
import { Transactional } from 'typeorm-transactional';
import { InsertIndicatorIdCommand } from './insert-indicator-id.command';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadataDto } from '../../query/get-indicator-board-metadata/indicator-board-metadata.dto';
import { IndicatorBoardMetadataMapper } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/mapper/indicator-board-metadata.mapper';

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
    const indicatorBoardMetadataDto: IndicatorBoardMetadataDto =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetadata(indicatorBoardMetadataId);
    const indicatorBoardMetaData = IndicatorBoardMetadataMapper.mapDtoToDomain(indicatorBoardMetadataDto);

    indicatorBoardMetaData.insertIndicatorId(indicatorId);

    await this.insertIndicatorIdPort.addIndicatorId(indicatorBoardMetaData);
  }
}
