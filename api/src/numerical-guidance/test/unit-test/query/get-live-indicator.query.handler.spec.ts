import { Test } from '@nestjs/testing';
import { GetFluctuatingIndicatorQuery } from '../../../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query';
import { CachingFluctuatingIndicatorPort } from '../../../application/port/cache/caching-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../../application/port/cache/load-cached-fluctuatingIndicator.port';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { FluctuatingIndicatorDto } from '../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { GetLiveIndicatorQueryHandler } from '../../../application/query/get-live-indicator/get-live-indicator.query.handler';
import { LoadLiveIndicatorPort } from '../../../application/port/external/load-live-indicator.port';
import { GetLiveIndicatorQuery } from '../../../application/query/get-live-indicator/get-live-indicator.query';

const testData = fluctuatingIndicatorTestData;
const testRedis = new Map<string, string>();

describe('GetLiveIndicatorQueryHandler', () => {
  let getLiveIndicatorQueryHandler: GetLiveIndicatorQueryHandler;
  let loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort;
  let loadLiveIndicatorPort: LoadLiveIndicatorPort;
  let cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        GetLiveIndicatorQueryHandler,
        {
          provide: 'LoadCachedFluctuatingIndicatorPort',
          useValue: {
            loadCachedFluctuatingIndicator: jest.fn().mockImplementation((key) => {
              return testRedis.get(key);
            }),
          },
        },
        {
          provide: 'LoadLiveIndicatorPort',
          useValue: {
            loadLiveIndicator: jest.fn().mockImplementation(() => {
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

    getLiveIndicatorQueryHandler = module.get(GetLiveIndicatorQueryHandler);
    loadCachedFluctuatingIndicatorPort = module.get('LoadCachedFluctuatingIndicatorPort');
    loadLiveIndicatorPort = module.get('LoadLiveIndicatorPort');
    cachingFluctuatingIndicatorPort = module.get('CachingFluctuatingIndicatorPort');
  }, 10000);

  it('변동지표를 불러온다.', async () => {
    //given
    const getLiveIndicatorQuery: GetLiveIndicatorQuery = new GetLiveIndicatorQuery('005930', 'KOSPI', 'day');

    //when
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);

    //then
    expect(loadLiveIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
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
    await getLiveIndicatorQueryHandler.execute(getfluctuatingIndicatorQuery);
    await getLiveIndicatorQueryHandler.execute(getfluctuatingIndicatorQuery);

    //then
    expect(loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator).toHaveBeenCalledTimes(2);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalledTimes(1);
    expect(loadLiveIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
  });
});
