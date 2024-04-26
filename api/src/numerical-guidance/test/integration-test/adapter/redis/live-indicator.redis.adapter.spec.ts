import { Test } from '@nestjs/testing';
import { LiveStockDto } from '../../../../application/query/live-indicator/dto/live-stock.dto';
import { LiveIndicatorRedisAdapter } from '../../../../infrastructure/adapter/redis/live-indicator.redis.adapter';
import { RedisModule } from '@nestjs-modules/ioredis';
import { liveIndicatorTestData } from '../../../data/liveIndicator.test.data';
import { ConfigModule } from '@nestjs/config';
import { RedisContainer } from '@testcontainers/redis';

const testData = liveIndicatorTestData;

describe('liveIndicatorRedisAdapter', () => {
  let environment;
  let liveIndicatorRedisAdapter: LiveIndicatorRedisAdapter;

  beforeAll(async () => {
    environment = await new RedisContainer().start();
    const module = await Test.createTestingModule({
      imports: [
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: () => ({
            type: 'single',
            url: environment.getConnectionUrl(),
          }),
        }),
      ],
      providers: [
        LiveIndicatorRedisAdapter,
        {
          provide: 'LoadCachedFluctuatingIndicatorPort',
          useClass: LiveIndicatorRedisAdapter,
        },
        {
          provide: 'CachingLiveIndicatorPort',
          useClass: LiveIndicatorRedisAdapter,
        },
      ],
    }).compile();

    liveIndicatorRedisAdapter = module.get(LiveIndicatorRedisAdapter);
  }, 10000);

  afterAll(async () => {
    await liveIndicatorRedisAdapter.disconnectRedis();
    await environment.stop();
  });

  it('redis에서 캐시된 값을 불러오는 경우.', async () => {
    //given
    const testCachingData = LiveStockDto.create({ ...testData });
    await liveIndicatorRedisAdapter.cachingLiveIndicator('stocks/', testCachingData);

    //when
    const result = await liveIndicatorRedisAdapter.loadCachedLiveIndicator('stocks/');

    //then
    const expected = LiveStockDto.create({ ...testData });

    expect(result).toEqual(expected);
  });

  it('redis에 캐시된 값이 없을 경우.', async () => {
    //given
    const indicatorId = '160e5499-4925-4e38-bb00-8ea6d8056484';
    const testCachingData = LiveStockDto.create({ indicatorId, ...testData });
    await liveIndicatorRedisAdapter.cachingLiveIndicator('testTicker', testCachingData);

    //when
    const result = await liveIndicatorRedisAdapter.loadCachedLiveIndicator('wrongTestTicker');

    //then
    const expected = null;

    expect(result).toEqual(expected);
  });
});
