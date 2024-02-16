import { Injectable } from '@nestjs/common';
import { LoadIndicatorListPort } from 'src/numerical-guidance/application/port/indicator-list/load-indicator-list.port';
import { IndicatorListDto } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';
import { DataSource } from 'typeorm';
import { IndicatorEntity } from './entity/indicator.entity';
import { IndicatorListMapper } from './mapper/indicator-list.mapper';

@Injectable()
export class IndicatorListAdapter implements LoadIndicatorListPort {
  constructor(private readonly dataSource: DataSource) {}

  async loadIndicatorList(): Promise<IndicatorListDto> {
    const indicatorEntities = await this.dataSource
      .getRepository(IndicatorEntity)
      .createQueryBuilder('indicator_entity')
      .getMany();

    const indicators: IndicatorListDto = IndicatorListMapper.mapEntityToDto(indicatorEntities);

    return indicators;
  }
}
