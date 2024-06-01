import { Test } from '@nestjs/testing';
import { CachingLiveIndicatorPort } from '../../../../application/port/cache/caching-live-indicator.port';
import { LoadCachedLiveIndicatorPort } from '../../../../application/port/cache/load-cached-live-indicator.port';
import { liveIndicatorTestData } from '../../../data/live-indicator-test-data';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { LiveStockDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import { GetLiveIndicatorQueryHandler } from '../../../../application/query/live-indicator/get-live-indicator/get-live-indicator.query.handler';
import { LoadLiveIndicatorPort } from '../../../../application/port/external/twelve/load-live-indicator.port';
import { GetLiveIndicatorQuery } from '../../../../application/query/live-indicator/get-live-indicator/get-live-indicator.query';
import { LoadIndicatorPort } from '../../../../application/port/persistence/indicator/load-indicator.port';
import { StockDto } from '../../../../application/query/indicator/get-indicator-list/dto/stock.dto';
import { EconomyDto } from '../../../../application/query/indicator/get-indicator-list/dto/economy.dto';
import { LoadLiveEconomyIndicatorPort } from '../../../../application/port/external/fred/load-live-economy-indicator.port';

const testData = liveIndicatorTestData;
const testIndicator: StockDto = {
  id: '5776afe3-6a3f-42e9-83ec-cb634b76f958',
  index: 1,
  symbol: 'AAPL',
  indicatorType: 'stocks',
  name: 'Apple Inc',
  currency: 'USD',
  exchange: 'NASDAQ',
  mic_code: 'XNGS',
  country: 'United States',
  type: 'Common Stock',
};

const testEconomyIndicator: EconomyDto = {
  id: '9493336a-2a81-473d-98e4-a7a682cf176f',
  index: 16,
  indicatorType: 'economy',
  symbol: 'GNPCA',
  name: 'Real Gross National Product',
  frequency: 'Annual',
  frequency_short: 'A',
  units: 'Billions of Chained 2017 Dollars',
  units_short: 'Bil. of Chn. 2017 $',
  seasonal_adjustment: 'Not Seasonally Adjusted',
  seasonal_adjustment_short: 'NSA',
  notes: 'BEA Account Code: A001RX',
};

describe('GetLiveIndicatorQueryHandler', () => {
  let getLiveIndicatorQueryHandler: GetLiveIndicatorQueryHandler;
  let loadCachedLiveIndicatorPort: LoadCachedLiveIndicatorPort;
  let loadLiveIndicatorPort: LoadLiveIndicatorPort;
  let loadIndicatorPort: LoadIndicatorPort;
  let cachingLiveIndicatorPort: CachingLiveIndicatorPort;
  let loadLiveEconomyIndicatorPort: LoadLiveEconomyIndicatorPort;

  beforeEach(async () => {
    const testRedis = new Map<string, string>();
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        GetLiveIndicatorQueryHandler,
        {
          provide: 'LoadCachedLiveIndicatorPort',
          useValue: {
            loadCachedLiveIndicator: jest.fn().mockImplementation((key) => {
              return testRedis.get(key);
            }),
          },
        },
        {
          provide: 'LoadLiveIndicatorPort',
          useValue: {
            loadLiveIndicator: jest.fn().mockImplementation(() => {
              return LiveStockDto.create({ indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484', ...testData });
            }),
          },
        },
        {
          provide: 'LoadIndicatorPort',
          useValue: {
            loadIndicator: jest.fn().mockImplementation(() => {
              return testIndicator;
            }),
          },
        },
        {
          provide: 'CachingLiveIndicatorPort',
          useValue: {
            cachingLiveIndicator: jest.fn().mockImplementation((key, value) => {
              testRedis.set(key, value);
            }),
          },
        },
        {
          provide: 'LoadLiveEconomyIndicatorPort',
          useValue: {
            loadLiveIndicator: jest.fn().mockImplementation(() => {
              return testEconomyIndicator;
            }),
          },
        },
      ],
    }).compile();

    getLiveIndicatorQueryHandler = module.get(GetLiveIndicatorQueryHandler);
    loadCachedLiveIndicatorPort = module.get('LoadCachedLiveIndicatorPort');
    loadIndicatorPort = module.get('LoadIndicatorPort');
    loadLiveIndicatorPort = module.get('LoadLiveIndicatorPort');
    cachingLiveIndicatorPort = module.get('CachingLiveIndicatorPort');
    loadLiveEconomyIndicatorPort = module.get('LoadLiveEconomyIndicatorPort');
  }, 10000);

  it('Live 지표를 불러온다.', async () => {
    //given
    const getLiveIndicatorQuery: GetLiveIndicatorQuery = new GetLiveIndicatorQuery(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      'day',
      '2024-02-11',
      'stocks',
    );

    //when
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);

    //then
    expect(loadLiveIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(1);
    expect(cachingLiveIndicatorPort.cachingLiveIndicator).toHaveBeenCalledTimes(1);
  });

  it('Live 지표가 redis에서 불러와진다.', async () => {
    //given
    const getLiveIndicatorQuery: GetLiveIndicatorQuery = new GetLiveIndicatorQuery(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      'day',
      '2024-02-11',
      'stocks',
    );

    //when
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);

    //then
    expect(loadCachedLiveIndicatorPort.loadCachedLiveIndicator).toHaveBeenCalledTimes(2);
    expect(cachingLiveIndicatorPort.cachingLiveIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(2);
    expect(loadLiveIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
  });

  it('Live 경제 지표를 불어온다.', async () => {
    //given
    const getLiveIndicatorQuery: GetLiveIndicatorQuery = new GetLiveIndicatorQuery(
      '9493336a-2a81-473d-98e4-a7a682cf176f',
      'none',
      '2010-02-11',
      'economy',
    );

    //when
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);
    await getLiveIndicatorQueryHandler.execute(getLiveIndicatorQuery);

    //then
    expect(loadCachedLiveIndicatorPort.loadCachedLiveIndicator).toHaveBeenCalledTimes(2);
    expect(cachingLiveIndicatorPort.cachingLiveIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(2);
    expect(loadLiveEconomyIndicatorPort.loadLiveIndicator).toHaveBeenCalledTimes(1);
  });
});
