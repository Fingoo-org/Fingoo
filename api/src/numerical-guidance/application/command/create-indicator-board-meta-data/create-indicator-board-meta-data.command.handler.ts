import { Inject, Injectable } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateIndicatorBoardMetaDataCommand } from './create-indicator-board-meta-data.command';
import { CreateIndicatorBoardMetaDataPort } from '../../port/persistent/create-indicator-board-meta-data.port';
import { IndicatorBoardMetaData } from '../../../domain/indicator-board-meta-data';
import { Transactional } from 'typeorm-transactional';

@Injectable()
@CommandHandler(CreateIndicatorBoardMetaDataCommand)
export class CreateIndicatorBoardMetaDataCommandHandler implements ICommandHandler {
  constructor(
    @Inject('CreateIndicatorBoardMetaDataPort')
    private readonly createIndicatorBoardMetaDataPort: CreateIndicatorBoardMetaDataPort,
  ) {}

  @Transactional()
  async execute(command: CreateIndicatorBoardMetaDataCommand): Promise<IndicatorBoardMetaData> {
    const { indicatorBoardMetaDataName, indicatorIds, memberId } = command;
    const indicatorBoardMetaData: IndicatorBoardMetaData = IndicatorBoardMetaData.createNew(
      indicatorBoardMetaDataName,
      indicatorIds,
      memberId,
    );

    await this.createIndicatorBoardMetaDataPort.createIndicatorBoardMetaData(indicatorBoardMetaData);

    return indicatorBoardMetaData;
  }
}
