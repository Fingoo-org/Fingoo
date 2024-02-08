import { Injectable } from '@nestjs/common';
import { CreateIndicatorBoardMetaDataPort } from '../../../application/port/persistent/create-indicator-board-meta-data.port';
import { IndicatorBoardMetaData } from '../../../domain/indicator-board-meta-data';

import { IndicatorBoardMetaDataEntity } from './entity/indicator-board-meta-data.entity';
import { IndicatorBoardMetaDataMapper } from './mapper/indicator-board-meta-data.mapper';
import { LoadIndicatorBoardMetaDataPort } from 'src/numerical-guidance/application/port/persistent/load-indicator-board-meta-data.port';

@Injectable()
export class IndicatorBoardMetaDataPersistentAdapter
  implements CreateIndicatorBoardMetaDataPort, LoadIndicatorBoardMetaDataPort
{
  async createIndicatorBoardMetaData(indicatorBoardMetaData: IndicatorBoardMetaData): Promise<number> {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetaDataEntity =
      IndicatorBoardMetaDataMapper.mapDomainToEntity(indicatorBoardMetaData);
    if (indicatorBoardMetaDataEntity.member instanceof Promise) {
      await indicatorBoardMetaDataEntity.member;
    }
    console.log(indicatorBoardMetaDataEntity);
    await indicatorBoardMetaDataEntity.save();
    return indicatorBoardMetaDataEntity.id;
  }

  async loadIndicatorBoardMetaData(id: number): Promise<IndicatorBoardMetaData> {
    const indicatorMetaDataEintity = await IndicatorBoardMetaDataEntity.findById(id);
    const indicatorBoardMetaData = await IndicatorBoardMetaDataMapper.mapEntityToDomain(indicatorMetaDataEintity);
    console.log(indicatorBoardMetaData);
    return indicatorBoardMetaData;
  }
}
