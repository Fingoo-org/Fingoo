import { Test } from '@nestjs/testing';
import { GetIndicatorListQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-list/get-indicator-list.query.handler';
import { IndicatorListDto } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';

const testData = {
  indicatorList: [
    {
      id: 1,
      name: '삼성전자',
      ticker: '005931',
      type: 'stock',
    },
    {
      id: 2,
      name: '이스트아시아홀딩스',
      ticker: '900110',
      type: 'stock',
    },
  ],
};

describe('GetIndicatorListQueryHandler', () => {
  let getIndicatorListQueryHandler: GetIndicatorListQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetIndicatorListQueryHandler,
        {
          provide: 'GetIndicatorListPort',
          useValue: {
            getIndicatorList: jest.fn().mockImplementation(() => {
              const indicatorList = IndicatorListDto.create(testData);
              return indicatorList;
            }),
          },
        },
      ],
    }).compile();
    getIndicatorListQueryHandler = module.get(GetIndicatorListQueryHandler);
  });

  it('데이터 베이스에서 지표 리스트를 가져온다.', async () => {
    // given

    // when
    const result = await getIndicatorListQueryHandler.execute();

    // then
    const expected = IndicatorListDto.create(testData);
    expect(result).toEqual(expected);
  });
});
