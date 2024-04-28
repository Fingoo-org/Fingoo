import { Injectable } from '@nestjs/common';
import { LoadCachedLiveIndicatorPort } from '../../../application/port/cache/load-cached-live-indicator.port';
import { CachingLiveIndicatorPort } from '../../../application/port/cache/caching-live-indicator.port';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { LiveIndicatorMapper } from '../twelve/mapper/live-indicator.mapper';
import { LiveIndicatorDtoType } from '../../../../utils/type/type-definition';

const REDIS_EXPIRE_TIME = 93600;

@Injectable()
export class LiveIndicatorRedisAdapter implements LoadCachedLiveIndicatorPort, CachingLiveIndicatorPort {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async loadCachedLiveIndicator(key: string): Promise<LiveIndicatorDtoType> {
    const data: string = await this.redis.get(key);
    const indicatorType = key.split('/')[0];
    return data && LiveIndicatorMapper.mapToDto(indicatorType, data);
  }

  async cachingLiveIndicator(key: string, indicatorDto: LiveIndicatorDtoType): Promise<void> {
    const value: string = JSON.stringify(indicatorDto);
    this.redis.set(key, value);
    this.redis.expire(key, REDIS_EXPIRE_TIME);
  }

  async disconnectRedis() {
    this.redis.disconnect();
  }
}
