import { Transactional } from 'typeorm-transactional';
import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveIndicatorListCommand } from './save-indicator-list.command';
import { SaveIndicatorListPort } from '../../../port/external/twelve/save-indicator-list.port';

@Injectable()
@CommandHandler(SaveIndicatorListCommand)
export class SaveIndicatorListCommandHandler implements ICommandHandler {
  constructor(
    @Inject('SaveIndicatorListPort')
    private readonly saveIndicatorListPort: SaveIndicatorListPort,
  ) {}

  @Transactional()
  async execute(command: SaveIndicatorListCommand) {
    const { count, country } = command;
    await this.saveIndicatorListPort.saveIndicatorList(count, country);
  }
}
