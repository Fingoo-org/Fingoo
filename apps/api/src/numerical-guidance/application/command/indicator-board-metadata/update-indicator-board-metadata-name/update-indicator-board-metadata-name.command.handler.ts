import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateIndicatorBoardMetadataNameCommand } from './update-indicator-board-metadata-name.command';
import { LoadIndicatorBoardMetadataPort } from '../../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { Transactional } from 'typeorm-transactional';
import { UpdateIndicatorBoardMetadataNamePort } from '../../../port/persistence/indicator-board-metadata/update-indicator-board-metadata-name.port';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

@Injectable()
@CommandHandler(UpdateIndicatorBoardMetadataNameCommand)
export class UpdateIndicatorBoardMetadataNameCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UpdateIndicatorBoardMetadataNamePort')
    private readonly updateIndicatorBoardMetadataNamePort: UpdateIndicatorBoardMetadataNamePort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: UpdateIndicatorBoardMetadataNameCommand) {
    const { id, name } = command;
    const indicatorBoardMetadata: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata(id);

    indicatorBoardMetadata.updateIndicatorBoardMetadataName(name);

    await this.updateIndicatorBoardMetadataNamePort.updateIndicatorBoardMetadataName(indicatorBoardMetadata);
  }
}
