import { Test } from '@nestjs/testing';
import { FluctuatingIndicatorsDto } from '../../../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { FluctuatingIndicatorRedisAdapter } from '../../../../infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { RedisModule } from '@nestjs-modules/ioredis';
import { fluctuatingIndicatorTestData } from '../../../data/fluctuatingIndicator.test.data';
import { ConfigModule } from '@nestjs/config';
import { RedisConfigService } from '../../../../../config/redis.config.service';
import { DockerComposeEnvironment } from 'testcontainers';

const testData = fluctuatingIndicatorTestData;
const composeFilePath = '';
const composeFileName = 'docker-compose-api.yml';

describe('FluctuatingIndicatorRedisAdapter', () => {
  let environment;
  let fluctuatingIndicatorRedisAdapter: FluctuatingIndicatorRedisAdapter;

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'build') {
      environment = await new DockerComposeEnvironment(composeFilePath, composeFileName).up(['redis']);
    }
    const module = await Test.createTestingModule({
      imports: [
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          useClass: RedisConfigService,
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
  });

  afterAll(async () => {
    if (environment) {
      await environment.down();
    }
    await fluctuatingIndicatorRedisAdapter.disconnectRedis();
  });

  it('redis에서 캐시된 값을 불러오는 경우.', async () => {
    //given
    const testCachingData = FluctuatingIndicatorsDto.create(testData);
    await fluctuatingIndicatorRedisAdapter.cachingFluctuatingIndicator('testTicker', testCachingData);

    //when
    const result = await fluctuatingIndicatorRedisAdapter.loadCachedFluctuatingIndicator('testTicker');

    //then
    const expected = FluctuatingIndicatorsDto.create(testData);

    expect(result).toEqual(expected);
  });

  it('redis에 캐시된 값이 없을 경우.', async () => {
    //given
    const testCachingData = FluctuatingIndicatorsDto.create(testData);
    await fluctuatingIndicatorRedisAdapter.cachingFluctuatingIndicator('testTicker', testCachingData);

    //when
    const result = await fluctuatingIndicatorRedisAdapter.loadCachedFluctuatingIndicator('wrongTestTicker');

    //then
    const expected = null;

    expect(result).toEqual(expected);
  });
});
