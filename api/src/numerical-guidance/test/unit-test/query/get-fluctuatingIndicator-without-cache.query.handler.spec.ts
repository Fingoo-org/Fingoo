import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorsWithoutCacheQueryHandler } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicator-without-cache.query.handler';
import { GetFluctuatingIndicatorsWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicators-without-cache.query';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';

const testData = fluctuatingIndicatorTestData;

describe('FluctucatingIndicatorKrxAdapter', () => {
  let getFluctuatingIndicatorsWithoutCacheQueryHandler: GetFluctuatingIndicatorsWithoutCacheQueryHandler;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetFluctuatingIndicatorsWithoutCacheQueryHandler,
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
    getFluctuatingIndicatorsWithoutCacheQueryHandler = module.get(GetFluctuatingIndicatorsWithoutCacheQueryHandler);
  });

  it('외부에서 변동 지표 데이터롤 가져온다', async () => {
    // given
    const testQuery = new GetFluctuatingIndicatorsWithoutCacheQuery(5, '005930', 'KOSPI');

    // when
    const result = await getFluctuatingIndicatorsWithoutCacheQueryHandler.execute(testQuery);

    // then
    const expected = FluctuatingIndicatorsDto.create(testData);
    expect(result).toEqual(expected);
  });
});
