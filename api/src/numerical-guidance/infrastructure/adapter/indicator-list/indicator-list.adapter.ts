import { Injectable } from '@nestjs/common';
import { GetIndicatorListPort } from 'src/numerical-guidance/application/port/indicator-list/get-indicator-list.port';
import { IndicatorListDto } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';

const testList = {
  indicatorList: [
    {
      name: '삼성전자',
      ticker: '005931',
      category: 'stock',
    },
    {
      name: '이스트아시아홀딩스',
      ticker: '900110',
      category: 'stock',
    },
  ],
};

@Injectable()
export class IndicatorListAdapter implements GetIndicatorListPort {
  constructor() {}

  async getIndicatorList(): Promise<IndicatorListDto> {
    const list = IndicatorListDto.create(testList);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(list);
      }, 2000);
    });
  }
}
