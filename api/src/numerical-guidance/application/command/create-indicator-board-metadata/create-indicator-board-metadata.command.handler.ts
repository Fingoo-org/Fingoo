import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateIndicatorBoardMetadataCommand } from './create-indicator-board-metadata.command';
import { CreateIndicatorBoardMetadataPort } from '../../port/persistence/create-indicator-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { Transactional } from 'typeorm-transactional';

@Injectable()
@CommandHandler(CreateIndicatorBoardMetadataCommand)
export class CreateIndicatorBoardMetadataCommandHandler implements ICommandHandler {
  constructor(
    @Inject('CreateIndicatorBoardMetaDataPort')
    private readonly createIndicatorBoardMetaDataPort: CreateIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: CreateIndicatorBoardMetadataCommand): Promise<IndicatorBoardMetadata> {
    const { indicatorBoardMetadataName, memberId } = command;
    const indicatorBoardMetaData: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew(indicatorBoardMetadataName);

    await this.createIndicatorBoardMetaDataPort.createIndicatorBoardMetaData(indicatorBoardMetaData, memberId);

    return indicatorBoardMetaData;
  }
}
