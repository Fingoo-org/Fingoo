import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateIndicatorBoardMetadataNameCommand } from './update-indicator-board-metadata-name.command';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { Transactional } from 'typeorm-transactional';
import { UpdateIndicatorBoardMetadataNamePort } from '../../port/persistence/indicator-board-metadata/update-indicator-board-metadata-name.port';
import { IndicatorBoardMetadataDto } from '../../query/get-indicator-board-metadata/indicator-board-metadata.dto';
import { IndicatorBoardMetadataMapper } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/mapper/indicator-board-metadata.mapper';

@Injectable()
@CommandHandler(UpdateIndicatorBoardMetadataNameCommand)
export class UpdateIndicatorBoardMetadataNameCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UpdateIndicatorBoardMetadataNamePort')
    private readonly updateIndicatorBoardMetadataNamePort: UpdateIndicatorBoardMetadataNamePort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: UpdateIndicatorBoardMetadataNameCommand) {
    const { id, name } = command;
    const indicatorBoardMetadataDto: IndicatorBoardMetadataDto =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetadata(id);
    const indicatorBoardMetaData = IndicatorBoardMetadataMapper.mapDtoToDomain(indicatorBoardMetadataDto);

    indicatorBoardMetaData.updateIndicatorBoardMetadataName(name);

    await this.updateIndicatorBoardMetadataNamePort.updateIndicatorBoardMetadataName(indicatorBoardMetaData);
  }
}
