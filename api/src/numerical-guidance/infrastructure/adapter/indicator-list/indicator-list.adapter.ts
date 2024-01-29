import { Injectable } from '@nestjs/common';
import { GetIndicatorListPort } from 'src/numerical-guidance/application/port/indicator-list/get-indicator-list.port';
import {
  IndicatorListDto,
  IndicatorResponse,
} from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';
import { DataSource } from 'typeorm';
import { IndicatorEntity } from './entity/indicator.entity';

@Injectable()
export class IndicatorListAdapter implements GetIndicatorListPort {
  constructor(private readonly dataSource: DataSource) {}

  async getIndicatorList(): Promise<IndicatorListDto> {
    const indicatorList = await this.dataSource
      .getRepository(IndicatorEntity)
      .createQueryBuilder('indicator_entity')
      .getMany();

    const indicators: IndicatorListDto = { indicatorList: [] };

    for (let i = 0; i < indicatorList.length; i++) {
      const response: IndicatorResponse = {
        id: indicatorList[i]['id'],
        name: indicatorList[i]['name'],
        ticker: indicatorList[i]['ticker'],
        type: indicatorList[i]['type'],
      };
      indicators.indicatorList.push(response);
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(indicators);
      }, 2000);
    });
  }
}
