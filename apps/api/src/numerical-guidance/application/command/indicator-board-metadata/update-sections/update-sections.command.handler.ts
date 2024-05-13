import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from 'typeorm-transactional';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { UpdateSectionsCommand } from './update-sections.command';
import { UpdateSectionsPort } from '../../../port/persistence/indicator-board-metadata/update-sections.port';
import { LoadIndicatorBoardMetadataPort } from '../../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';

@Injectable()
@CommandHandler(UpdateSectionsCommand)
export class UpdateSectionsCommandHandler implements ICommandHandler {
  constructor(
    @Inject('UpdateSectionsPort')
    private readonly updateSectionsPort: UpdateSectionsPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetadataPort: LoadIndicatorBoardMetadataPort,
  ) {}

  @Transactional()
  async execute(command: UpdateSectionsCommand) {
    const { id, sections } = command;
    const indicatorBoardMetadata: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetadataPort.loadIndicatorBoardMetadata(id);

    indicatorBoardMetadata.updateSections(sections);
    await this.updateSectionsPort.updateSections(indicatorBoardMetadata);
  }
}
