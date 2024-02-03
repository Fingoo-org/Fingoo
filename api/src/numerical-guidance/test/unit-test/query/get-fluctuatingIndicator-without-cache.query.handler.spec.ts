import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorWithoutCacheQueryHandler } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query.handler';
import { GetFluctuatingIndicatorWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';

const testData = fluctuatingIndicatorTestData;

describe('FluctucatingIndicatorKrxAdapter', () => {
  let getFluctuatingIndicatorWithoutCacheQueryHandler: GetFluctuatingIndicatorWithoutCacheQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetFluctuatingIndicatorWithoutCacheQueryHandler,
        {
          provide: 'LoadFluctuatingIndicatorPort',
          useValue: {
            loadFluctuatingIndicator: jest.fn().mockImplementation(() => {
              const apiData = FluctuatingIndicatorDto.create(testData);
              return apiData;
            }),
          },
        },
      ],
    }).compile();
    getFluctuatingIndicatorWithoutCacheQueryHandler = module.get(GetFluctuatingIndicatorWithoutCacheQueryHandler);
  });

  it('외부에서 변동 지표 데이터롤 가져온다', async () => {
    // given
    const testQuery = new GetFluctuatingIndicatorWithoutCacheQuery(5, '005930', 'day', 'KOSPI', '20240125');

    // when
    const result = await getFluctuatingIndicatorWithoutCacheQueryHandler.execute(testQuery);

    // then
    const expected = FluctuatingIndicatorDto.create(testData);
    expect(result).toEqual(expected);
  });
});
