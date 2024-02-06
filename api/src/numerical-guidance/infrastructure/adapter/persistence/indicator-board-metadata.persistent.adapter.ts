import { Injectable } from '@nestjs/common';
import { CreateIndicatorBoardMetadataPort } from '../../../application/port/persistent/create-indicator-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

import { IndicatorBoardMetadataEntity } from './entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadataMapper } from './mapper/indicator-board-metadata.mapper';

@Injectable()
export class IndicatorBoardMetadataPersistentAdapter implements CreateIndicatorBoardMetadataPort {
  async createIndicatorBoardMetaData(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<number> {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity =
      IndicatorBoardMetadataMapper.mapDomainToEntity(indicatorBoardMetaData);
    await indicatorBoardMetaDataEntity.save();
    return indicatorBoardMetaDataEntity.id;
  }
}
