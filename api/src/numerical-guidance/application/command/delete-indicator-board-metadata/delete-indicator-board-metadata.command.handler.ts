import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteIndicatorBoardMetadataPort } from '../../port/persistence/delete-indicator-board-metadata.port';
import { Transactional } from 'typeorm-transactional';
import { DeleteIndicatorBoardMetadataCommand } from './delete-indicator-board-metadata.command';

@Injectable()
@CommandHandler(DeleteIndicatorBoardMetadataCommand)
export class DeleteIndicatorBoardMetadataCommandHandler implements ICommandHandler {
  constructor(
    @Inject('DeleteIndicatorBoardMetadataPort')
    private readonly deleteIndicatorBoardMetadataPort: DeleteIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: DeleteIndicatorBoardMetadataCommand) {
    const { id } = command;
    await this.deleteIndicatorBoardMetadataPort.deleteIndicatorBoardMetadata(id);
  }
}
