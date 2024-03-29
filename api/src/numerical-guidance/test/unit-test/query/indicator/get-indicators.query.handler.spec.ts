import { Test } from '@nestjs/testing';
import { GetIndicatorsQueryHandler } from 'src/numerical-guidance/application/query/indicator/get-indicator/get-indicators.query.handler';
import { IndicatorsDto } from '../../../../application/query/indicator/dto/indicators.dto';
import { Indicator } from '../../../../application/query/indicator/dto/indicator.dto';

interface TestData {
  indicators: Indicator[];
}

const testData: TestData = {
  indicators: [
    {
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      name: '삼성전자',
      ticker: '005931',
      type: 'k-stock',
      market: 'KOSPI',
    },
    {
      id: '1ebee29f-7208-4df6-b53d-521b2f81fdce',
      name: '이스트아시아홀딩스',
      ticker: '900110',
      type: 'k-stock',
      market: 'KOSDAQ',
    },
  ],
};

describe('GetIndicatorsQueryHandler', () => {
  let getIndicatorsQueryHandler: GetIndicatorsQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetIndicatorsQueryHandler,
        {
          provide: 'LoadIndicatorsPort',
          useValue: {
            loadIndicators: jest.fn().mockImplementation(() => {
              const indicators: Indicator[] = testData.indicators;
              return IndicatorsDto.create(indicators);
            }),
          },
        },
      ],
    }).compile();
    getIndicatorsQueryHandler = module.get(GetIndicatorsQueryHandler);
  });

  it('데이터 베이스에서 지표 리스트를 가져온다.', async () => {
    // given

    // when
    const result = await getIndicatorsQueryHandler.execute();

    // then
    const expected = testData.indicators;
    expect(result).toEqual(expected);
  });
});
