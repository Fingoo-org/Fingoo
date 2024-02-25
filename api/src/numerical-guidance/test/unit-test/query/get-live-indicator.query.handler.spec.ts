import { Test } from '@nestjs/testing';
import { CachingFluctuatingIndicatorPort } from '../../../application/port/cache/caching-fluctuatingIndicator.port';
import { LoadCachedFluctuatingIndicatorPort } from '../../../application/port/cache/load-cached-fluctuatingIndicator.port';
import { fluctuatingIndicatorTestData } from '../../data/fluctuatingIndicator.test.data';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { FluctuatingIndicatorDto } from '../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { GetLiveIndicatorQueryHandler } from '../../../application/query/get-live-indicator/get-live-indicator.query.handler';
import { LoadLiveIndicatorPort } from '../../../application/port/external/load-live-indicator.port';
import { GetLiveIndicatorQuery } from '../../../application/query/get-live-indicator/get-live-indicator.query';
import { Indicator, IndicatorDto } from '../../../application/query/get-indicator/indicator.dto';
import { LoadIndicatorPort } from '../../../application/port/persistence/indicator/load-indicator.port';

const testData = fluctuatingIndicatorTestData;
const testIndicator: Indicator = {
  id: '160e5499-4925-4e38-bb00-8ea6d8056484',
  name: '삼성전자',
  ticker: '005931',
  type: 'k-stock',
  market: 'KOSPI',
};

describe('GetLiveIndicatorQueryHandler', () => {
  let getLiveIndicatorQueryHandler: GetLiveIndicatorQueryHandler;
  let loadCachedFluctuatingIndicatorPort: LoadCachedFluctuatingIndicatorPort;
  let loadLiveIndicatorPort: LoadLiveIndicatorPort;
  let loadIndicatorPort: LoadIndicatorPort;
  let cachingFluctuatingIndicatorPort: CachingFluctuatingIndicatorPort;

  beforeEach(async () => {
    const testRedis = new Map<string, string>();
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
          provide: 'LoadIndicatorPort',
          useValue: {
            loadIndicator: jest.fn().mockImplementation(() => {
              return IndicatorDto.create(testIndicator);
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
    loadIndicatorPort = module.get('LoadIndicatorPort');
    loadLiveIndicatorPort = module.get('LoadLiveIndicatorPort');
    cachingFluctuatingIndicatorPort = module.get('CachingFluctuatingIndicatorPort');
  }, 10000);

  it('변동지표를 불러온다.', async () => {
    //given
    const getLiveIndicatorQuery: GetLiveIndicatorQuery = new GetLiveIndicatorQuery(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      'day',
    );

    //when
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);

    //then
    expect(loadLiveIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(1);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalledTimes(1);
  });

  it('변동지표가 redis에서 불러와진다.', async () => {
    //given
    const getLiveIndicatorQuery: GetLiveIndicatorQuery = new GetLiveIndicatorQuery(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      'day',
    );

    //when
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);

    //then
    expect(loadCachedFluctuatingIndicatorPort.loadCachedFluctuatingIndicator).toHaveBeenCalledTimes(2);
    expect(cachingFluctuatingIndicatorPort.cachingFluctuatingIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(2);
    expect(loadLiveIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
  });
});
