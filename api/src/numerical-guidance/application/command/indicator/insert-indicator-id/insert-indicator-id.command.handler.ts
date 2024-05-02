import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { InsertIndicatorIdPort } from '../../../port/persistence/indicator-board-metadata/insert-indicator-id.port';
import { Transactional } from 'typeorm-transactional';
import { InsertIndicatorIdCommand } from './insert-indicator-id.command';
import { LoadIndicatorBoardMetadataPort } from '../../../port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { IndicatorBoardMetadata, IndicatorInfo } from '../../../../domain/indicator-board-metadata';
import { LoadIndicatorPort } from '../../../port/persistence/indicator/load-indicator.port';
import { IndicatorDtoType } from '../../../../../utils/type/type-definition';

@Injectable()
@CommandHandler(InsertIndicatorIdCommand)
export class InsertIndicatorIdCommandHandler implements ICommandHandler {
  constructor(
    @Inject('InsertIndicatorIdPort')
    private readonly insertIndicatorIdPort: InsertIndicatorIdPort,
    @Inject('LoadIndicatorBoardMetadataPort')
    private readonly loadIndicatorBoardMetaDataPort: LoadIndicatorBoardMetadataPort,
    @Inject('LoadIndicatorPort')
    private readonly loadIndicatorPort: LoadIndicatorPort,
  ) {}

  @Transactional()
  async execute(command: InsertIndicatorIdCommand) {
    const { indicatorBoardMetadataId, indicatorId, indicatorType } = command;
    const indicatorBoardMetaData: IndicatorBoardMetadata =
      await this.loadIndicatorBoardMetaDataPort.loadIndicatorBoardMetadata(indicatorBoardMetadataId);

    const indicatorDto = await this.loadIndicatorPort.loadIndicator(indicatorId, indicatorType);

    indicatorBoardMetaData.insertIndicatorId(this.getIndicatorInfo(indicatorDto));

    await this.insertIndicatorIdPort.addIndicatorId(indicatorBoardMetaData);
  }

  private getIndicatorInfo(indicatorDto: IndicatorDtoType): IndicatorInfo {
    console.log('name', indicatorDto);
    return {
      id: indicatorDto.id,
      symbol: indicatorDto.symbol,
      indicatorType: indicatorDto.indicatorType,
      name: this.getIndicatorNameByType(indicatorDto),
      exchange: this.getIndicatorExchangeByType(indicatorDto),
    };
  }

  private getIndicatorNameByType(indicatorDto): string {
    if (indicatorDto.indicatorType === 'cryptocurrencies' || indicatorDto.indicatorType === 'forex_pairs') {
      return indicatorDto.currency_base;
    }
    return indicatorDto.name;
  }

  private getIndicatorExchangeByType(indicatorDto): string {
    if (indicatorDto.indicatorType === 'cryptocurrencies') {
      return indicatorDto.currency_base;
    }
    if (indicatorDto.indicatorType == 'forex_pairs') {
      return indicatorDto.currency_group;
    }
    return indicatorDto.exchange;
  }
}
