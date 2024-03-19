import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateIndicatorBoardMetadataCommand } from './create-indicator-board-metadata.command';
import { CreateIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/create-indicator-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';
import { Transactional } from 'typeorm-transactional';

@Injectable()
@CommandHandler(CreateIndicatorBoardMetadataCommand)
export class CreateIndicatorBoardMetadataCommandHandler implements ICommandHandler {
  constructor(
    @Inject('CreateIndicatorBoardMetadataPort')
    private readonly createIndicatorBoardMetadataPort: CreateIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: CreateIndicatorBoardMetadataCommand): Promise<string> {
    const { indicatorBoardMetadataName, memberId } = command;
    const indicatorBoardMetadata: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew(indicatorBoardMetadataName);

    return await this.createIndicatorBoardMetadataPort.createIndicatorBoardMetadata(indicatorBoardMetadata, memberId);
  }
}
