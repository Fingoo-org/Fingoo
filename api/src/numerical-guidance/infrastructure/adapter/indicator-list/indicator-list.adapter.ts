import { Injectable } from '@nestjs/common';
import { LoadIndicatorListPort } from 'src/numerical-guidance/application/port/indicator-list/load-indicator-list.port';
import { IndicatorListDto } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';
import { DataSource } from 'typeorm';
import { IndicatorEntity } from './entity/indicator.entity';

@Injectable()
export class IndicatorListAdapter implements LoadIndicatorListPort {
  constructor(private readonly dataSource: DataSource) {}

  async loadIndicatorList(): Promise<IndicatorListDto> {
    const indicatorList = await this.dataSource
      .getRepository(IndicatorEntity)
      .createQueryBuilder('indicator_entity')
      .getMany();

    const indicators = IndicatorListDto.create({
      indicatorList: indicatorList.map((indicator) => ({
        id: indicator['id'],
        name: indicator['name'],
        ticker: indicator['ticker'],
        type: indicator['type'],
      })),
    });

    return indicators;
  }
}
