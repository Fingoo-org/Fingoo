import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorDto } from '../../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { FluctuatingIndicatorRedisAdapter } from '../../../../infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { RedisModule } from '@nestjs-modules/ioredis';
import { fluctuatingIndicatorTestData } from '../../../data/fluctuatingIndicator.test.data';
import { ConfigModule } from '@nestjs/config';
import { RedisContainer } from '@testcontainers/redis';

const testData = fluctuatingIndicatorTestData;

describe('FluctuatingIndicatorRedisAdapter', () => {
  let environment;
  let fluctuatingIndicatorRedisAdapter: FluctuatingIndicatorRedisAdapter;

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
        FluctuatingIndicatorRedisAdapter,
        {
          provide: 'LoadCachedFluctuatingIndicatorPort',
          useClass: FluctuatingIndicatorRedisAdapter,
        },
        {
          provide: 'CachingFluctuatingIndicatorPort',
          useClass: FluctuatingIndicatorRedisAdapter,
        },
      ],
    }).compile();

    fluctuatingIndicatorRedisAdapter = module.get(FluctuatingIndicatorRedisAdapter);
  }, 10000);

  afterAll(async () => {
    await fluctuatingIndicatorRedisAdapter.disconnectRedis();
    await environment.stop();
  });

  it('redis에서 캐시된 값을 불러오는 경우.', async () => {
    //given
    const testCachingData = FluctuatingIndicatorDto.create(testData);
    await fluctuatingIndicatorRedisAdapter.cachingFluctuatingIndicator('testTicker', testCachingData);

    //when
    const result = await fluctuatingIndicatorRedisAdapter.loadCachedFluctuatingIndicator('testTicker');

    //then
    const expected = FluctuatingIndicatorDto.create(testData);

    expect(result).toEqual(expected);
  });

  it('redis에 캐시된 값이 없을 경우.', async () => {
    //given
    const testCachingData = FluctuatingIndicatorDto.create(testData);
    await fluctuatingIndicatorRedisAdapter.cachingFluctuatingIndicator('testTicker', testCachingData);

    //when
    const result = await fluctuatingIndicatorRedisAdapter.loadCachedFluctuatingIndicator('wrongTestTicker');

    //then
    const expected = null;

    expect(result).toEqual(expected);
  });
});
