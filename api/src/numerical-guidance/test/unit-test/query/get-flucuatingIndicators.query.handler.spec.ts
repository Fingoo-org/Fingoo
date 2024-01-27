import { Test } from '@nestjs/testing';
import { GetFluctuatingIndicatorsQueryHandler } from '../../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query.handler';
import { GetFluctuatingIndicatorsQuery } from '../../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query';
import { CachingFluctuatingIndicatorPort } from '../../../application/port/cache/caching-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../../application/port/cache/load-cached-fluctuatingIndicator.port';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';
import { LoadFluctuatingIndicatorPort } from '../../../application/port/external/load-fluctuatingIndicator.port';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { FluctuatingIndicatorsDto } from '../../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

const testData = fluctuatingIndicatorTestData;
const testRedis = new Map<string, string>();

describe('GetFluctuatingIndicatorsQueryHandler', () => {
  let getFluctuatingIndicatorsQueryHandler: GetFluctuatingIndicatorsQueryHandler;
  let loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort;
  let loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort;
  let cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        GetFluctuatingIndicatorsQueryHandler,
        {
          provide: 'LoadCachedFluctuatingIndicatorPort',
          useValue: {
            loadCachedFluctuatingIndicator: jest.fn().mockImplementation((key) => {
              return testRedis.get(key);
            }),
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
            cachingFluctuatingIndicator: jest.fn().mockImplementation((key, value) => {
              testRedis.set(key, value);
            }),
          },
        },
      ],
    }).compile();

    getFluctuatingIndicatorsQueryHandler = module.get(GetFluctuatingIndicatorsQueryHandler);
    loadCachedFluctuatingIndicatorPort = module.get('LoadCachedFluctuatingIndicatorPort');
    loadFluctuatingIndicatorPort = module.get('LoadFluctuatingIndicatorPort');
    cachingFluctuatingIndicatorPort = module.get('CachingFluctuatingIndicatorPort');
  }, 10000);

  it('변동지표를 불러온다.', async () => {
    //given
    const getFluctuatingIndicatorsQuery: GetFluctuatingIndicatorsQuery = new GetFluctuatingIndicatorsQuery(
      5,
      [{ ticker: '005930', market: 'KOSPI' }],
      'day',
      '20240125',
    );

    //when
    await getFluctuatingIndicatorsQueryHandler.execute(getFluctuatingIndicatorsQuery);

    //then
    expect(loadFluctuatingIndicatorPort.loadFluctuatingIndicator).toHaveBeenCalledTimes(1);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalledTimes(1);
  });

  it('변동지표가 redis에서 불러와진다.', async () => {
    //given
    const getFluctuatingIndicatorsQuery: GetFluctuatingIndicatorsQuery = new GetFluctuatingIndicatorsQuery(
      5,
      [{ ticker: '005931', market: 'KOSPI' }],
      'day',
      '20240125',
    );

    //when
    await getFluctuatingIndicatorsQueryHandler.execute(getFluctuatingIndicatorsQuery);
    await getFluctuatingIndicatorsQueryHandler.execute(getFluctuatingIndicatorsQuery);

    //then
    expect(loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator).toHaveBeenCalledTimes(2);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalledTimes(1);
    expect(loadFluctuatingIndicatorPort.loadFluctuatingIndicator).toHaveBeenCalledTimes(1);
  });
});
