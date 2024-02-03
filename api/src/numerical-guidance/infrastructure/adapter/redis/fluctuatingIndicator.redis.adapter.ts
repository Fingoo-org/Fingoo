import { Injectable } from '@nestjs/common';
import { LoadCachedFluctuatingIndicatorPort } from '../../../application/port/cache/load-cached-fluctuatingIndicator.port';
import { FluctuatingIndicatorDto } from '../../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { CachingFluctuatingIndicatorPort } from '../../../application/port/cache/caching-fluctuatingIndicator.port';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { FluctuatingIndicatorMapper } from '../krx/mapper/fluctuatingIndicator.mapper';

@Injectable()
export class FluctuatingIndicatorRedisAdapter
  implements LoadCachedFluctuatingIndicatorPort, CachingFluctuatingIndicatorPort
{
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async loadCachedFluctuatingIndicator(ticker: string): Promise<FluctuatingIndicatorDto | null> {
    const data: string = await this.redis.get(ticker);
    return data && FluctuatingIndicatorMapper.mapToDto(data);
  }

  async cachingFluctuatingIndicator(key: string, fluctuatingIndicatorDto: FluctuatingIndicatorDto): Promise<void> {
    const value: string = JSON.stringify(fluctuatingIndicatorDto);
    this.redis.set(key, value);
    this.redis.expire(key, 93600);
  }

  async disconnectRedis() {
    this.redis.disconnect();
  }
}
