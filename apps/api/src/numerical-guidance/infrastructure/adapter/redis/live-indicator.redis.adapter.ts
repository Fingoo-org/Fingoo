import { Injectable } from '@nestjs/common';
import { LoadCachedLiveIndicatorPort } from '../../../application/port/cache/load-cached-live-indicator.port';
import { CachingLiveIndicatorPort } from '../../../application/port/cache/caching-live-indicator.port';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { LiveIndicatorMapper } from '../twelve/mapper/live-indicator.mapper';
import { LiveIndicatorDtoType } from '../../../../utils/type/type-definition';

const REDIS_EXPIRE_DAY = 86400; // 하루
const REDIS_EXPIRE_WEEK = 604800; // 1주일
const REDIS_EXPIRE_MONTH = 2592000; // 1달
const REDIS_EXPIRE_YEAR = 31536000; // 1년

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
    let expireTime = REDIS_EXPIRE_DAY;

    if (key.includes('-interval:day-')) {
      expireTime = REDIS_EXPIRE_DAY;
    } else if (key.includes('-interval:week-')) {
      expireTime = REDIS_EXPIRE_WEEK;
    } else if (key.includes('-interval:month-')) {
      expireTime = REDIS_EXPIRE_MONTH;
    } else if (key.includes('-interval:year-')) {
      expireTime = REDIS_EXPIRE_YEAR;
    }

    this.redis.set(key, value);
    this.redis.expire(key, expireTime);
  }

  async disconnectRedis() {
    this.redis.disconnect();
  }
}
