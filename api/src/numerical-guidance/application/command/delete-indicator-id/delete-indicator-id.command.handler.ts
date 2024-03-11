import { Transactional } from 'typeorm-transactional';
import { LoadIndicatorBoardMetadataPort } from '../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { DeleteIndicatorIdCommand } from './delete-indicator-id.command';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteIndicatorIdPort } from '../../port/persistence/indicator-board-metadata/delete-indicator-id.port';
import { IndicatorBoardMetadataDto } from '../../query/get-indicator-board-metadata/indicator-board-metadata.dto';
import { IndicatorBoardMetadataMapper } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/mapper/indicator-board-metadata.mapper';

@Injectable()
@CommandHandler(DeleteIndicatorIdCommand)
export class DeleteIndicatorIdCommandHandler implements ICommandHandler {
  constructor(
    @Inject('DeleteIndicatorIdPort')
    private readonly deleteIndicatorIdPort: DeleteIndicatorIdPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: DeleteIndicatorIdCommand) {
    const { indicatorBoardMetadataId, indicatorId } = command;
    const indicatorBoardMetadataDto: IndicatorBoardMetadataDto =
      await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata(indicatorBoardMetadataId);
    const indicatorBoardMetadata = IndicatorBoardMetadataMapper.mapDtoToDomain(indicatorBoardMetadataDto);
    indicatorBoardMetadata.deleteIndicatorId(indicatorId);

    await this.deleteIndicatorIdPort.deleteIndicatorId(indicatorBoardMetadata);
  }
}
