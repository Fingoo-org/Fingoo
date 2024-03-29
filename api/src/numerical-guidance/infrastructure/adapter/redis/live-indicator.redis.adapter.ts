import { Injectable } from '@nestjs/common';
import { LoadCachedLiveIndicatorPort } from '../../../application/port/cache/load-cached-live-indicator.port';
import { LiveKRXIndicatorDto } from '../../../application/query/live-indicator/dto/live-indicator.dto';
import { CachingLiveIndicatorPort } from '../../../application/port/cache/caching-live-indicator.port';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { LiveIndicatorMapper } from '../krx/mapper/live-indicator.mapper';

@Injectable()
export class LiveIndicatorRedisAdapter implements LoadCachedLiveIndicatorPort, CachingLiveIndicatorPort {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async loadCachedLiveIndicator(ticker: string): Promise<LiveKRXIndicatorDto | null> {
    const data: string = await this.redis.get(ticker);
    return data && LiveIndicatorMapper.mapToDto(data);
  }

  async cachingLiveIndicator(key: string, fluctuatingIndicatorDto: LiveKRXIndicatorDto): Promise<void> {
    const value: string = JSON.stringify(fluctuatingIndicatorDto);
    this.redis.set(key, value);
    this.redis.expire(key, 93600);
  }

  async disconnectRedis() {
    this.redis.disconnect();
  }
}
