import { Test } from '@nestjs/testing';
import { GetFluctuatingIndicatorsQueryHandler } from '../../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query.handler';
import { FluctuatingIndicatorsDto } from '../../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorsQuery } from '../../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query';
import { CachingFluctuatingIndicatorPort } from '../../../application/port/cache/caching-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../../application/port/cache/load-cached-fluctuatingIndicator.port';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';
// import { LoadFluctuatingIndicatorPort } from '../../../application/port/external/load-fluctuatingIndicator.port';

const testData = fluctuatingIndicatorTestData;

describe('GetFluctuatingIndicatorsQueryHandler', () => {
  let getFluctuatingIndicatorsQueryHandler: GetFluctuatingIndicatorsQueryHandler;
  let loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort;
  // let loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort;
  let cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GetFluctuatingIndicatorsQueryHandler,
        {
          provide: 'LoadCachedFluctuatingIndicatorPort',
          useValue: {
            loadCachedFluctuatingIndicator: jest.fn(),
          },
        },
        {
          provide: 'LoadFluctuatingIndicatorPort',
          useValue: {
            loadFluctuatingIndicator: jest.fn().mockImplementation(() => {
              return FluctuatingIndicatorsDto.create(testData);
            }),
          },
        },
        {
          provide: 'CachingFluctuatingIndicatorPort',
          useValue: {
            cachingFluctuatingIndicator: jest.fn(),
          },
        },
      ],
    }).compile();

    getFluctuatingIndicatorsQueryHandler = module.get(GetFluctuatingIndicatorsQueryHandler);
    loadCachedFluctuatingIndicatorPort = module.get('LoadCachedFluctuatingIndicatorPort');
    // loadFluctuatingIndicatorPort = module.get('LoadFluctuatingIndicatorPort');
    cachingFluctuatingIndicatorPort = module.get('CachingFluctuatingIndicatorPort');
  });

  it('변동지표를 불러온다.', async () => {
    //given
    const getFluctuatingIndicatorsQuery: GetFluctuatingIndicatorsQuery = new GetFluctuatingIndicatorsQuery(2, [
      { ticker: 'KR7005930001', market: 'KOSPI' },
    ]);
    //when
    const result = await getFluctuatingIndicatorsQueryHandler.execute(getFluctuatingIndicatorsQuery);

    //then
    const expected = FluctuatingIndicatorsDto.create(testData);

    expect(result[0]).toEqual(expected);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalled();
  });

  it('변동지표가 redis에서 불러와진다.', async () => {
    //given
    const getFluctuatingIndicatorsQuery: GetFluctuatingIndicatorsQuery = new GetFluctuatingIndicatorsQuery(2, [
      { ticker: 'KR7005930009', market: 'KOSPI' },
    ]);
    //when
    await getFluctuatingIndicatorsQueryHandler.execute(getFluctuatingIndicatorsQuery);
    const result2 = await getFluctuatingIndicatorsQueryHandler.execute(getFluctuatingIndicatorsQuery);

    //then
    const expected = FluctuatingIndicatorsDto.create(testData);

    expect(result2[0]).toEqual(expected);
    expect(loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator).toHaveBeenCalled();
    // expect(loadFluctuatingIndicatorPort.loadFluctuatingIndicator).not.toHaveBeenCalled(); // TODO: 외부 api와 연동 후 테스트
  });
});
