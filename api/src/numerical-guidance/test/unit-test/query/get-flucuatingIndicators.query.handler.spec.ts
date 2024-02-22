import { Test } from '@nestjs/testing';
import { GetFluctuatingIndicatorQueryHandler } from '../../../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query.handler';
import { GetFluctuatingIndicatorQuery } from '../../../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query';
import { CachingFluctuatingIndicatorPort } from '../../../application/port/cache/caching-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../../application/port/cache/load-cached-fluctuatingIndicator.port';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';
import { LoadFluctuatingIndicatorPort } from '../../../application/port/external/load-fluctuatingIndicator.port';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { FluctuatingIndicatorDto } from '../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';

const testData = fluctuatingIndicatorTestData;
const testRedis = new Map<string, string>();

describe('GetFluctuatingIndicatorQueryHandler', () => {
  let getFluctuatingIndicatorQueryHandler: GetFluctuatingIndicatorQueryHandler;
  let loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort;
  let loadFluctuatingIndicatorPort: LoadFluctuatingIndicatorPort;
  let cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        GetFluctuatingIndicatorQueryHandler,
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
              return FluctuatingIndicatorDto.create(testData);
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

    getFluctuatingIndicatorQueryHandler = module.get(GetFluctuatingIndicatorQueryHandler);
    loadCachedFluctuatingIndicatorPort = module.get('LoadCachedFluctuatingIndicatorPort');
    loadFluctuatingIndicatorPort = module.get('LoadFluctuatingIndicatorPort');
    cachingFluctuatingIndicatorPort = module.get('CachingFluctuatingIndicatorPort');
  }, 10000);

  it('변동지표를 불러온다.', async () => {
    //given
    const getfluctuatingIndicatorQuery: GetFluctuatingIndicatorQuery = new GetFluctuatingIndicatorQuery(
      5,
      '005930',
      'KOSPI',
      'day',
      '20240125',
    );

    //when
    await getFluctuatingIndicatorQueryHandler.execute(getfluctuatingIndicatorQuery);

    //then
    expect(loadFluctuatingIndicatorPort.loadFluctuatingIndicator).toHaveBeenCalledTimes(1);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalledTimes(1);
  });

  it('변동지표가 redis에서 불러와진다.', async () => {
    //given
    const getfluctuatingIndicatorQuery: GetFluctuatingIndicatorQuery = new GetFluctuatingIndicatorQuery(
      5,
      '005931',
      'KOSPI',
      'day',
      '20240125',
    );

    //when
    await getFluctuatingIndicatorQueryHandler.execute(getfluctuatingIndicatorQuery);
    await getFluctuatingIndicatorQueryHandler.execute(getfluctuatingIndicatorQuery);

    //then
    expect(loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator).toHaveBeenCalledTimes(2);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalledTimes(1);
    expect(loadFluctuatingIndicatorPort.loadFluctuatingIndicator).toHaveBeenCalledTimes(1);
  });
});
