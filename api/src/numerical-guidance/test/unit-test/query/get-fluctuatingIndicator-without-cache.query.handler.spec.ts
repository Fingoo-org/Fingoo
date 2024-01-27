import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorWithoutCacheQueryHandler } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicator-without-cache.query.handler';
import { GetFluctuatingIndicatorWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicator-without-cache.query';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';

const testData = fluctuatingIndicatorTestData;

describe('FluctucatingIndicatorKrxAdapter', () => {
  let getFluctuatingIndicatorsWithoutCacheQueryHandler: GetFluctuatingIndicatorWithoutCacheQueryHandler;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetFluctuatingIndicatorWithoutCacheQueryHandler,
        {
          provide: 'LoadFluctuatingIndicatorPort',
          useValue: {
            loadFluctuatingIndicator: jest.fn().mockImplementation(() => {
              const apiData = FluctuatingIndicatorsDto.create(testData);
              return apiData;
            }),
          },
        },
      ],
    }).compile();
    getFluctuatingIndicatorsWithoutCacheQueryHandler = module.get(GetFluctuatingIndicatorWithoutCacheQueryHandler);
  });

  it('외부에서 변동 지표 데이터롤 가져온다', async () => {
    // given
    const testQuery = new GetFluctuatingIndicatorWithoutCacheQuery(5, '005930', 'day', 'KOSPI', '20240125');

    // when
    const result = await getFluctuatingIndicatorsWithoutCacheQueryHandler.execute(testQuery);

    // then
    const expected = FluctuatingIndicatorsDto.create(testData);
    expect(result).toEqual(expected);
  });
});
