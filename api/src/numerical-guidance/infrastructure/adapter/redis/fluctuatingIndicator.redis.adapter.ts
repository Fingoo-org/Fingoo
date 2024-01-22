import { Injectable } from '@nestjs/common';
import { LoadCachedFluctuatingIndicatorPort } from '../../../application/port/cache/load-cached-fluctuatingIndicator.port';
import { FluctuatingIndicatorsDto } from '../../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { CachingFluctuatingIndicatorPort } from '../../../application/port/cache/caching-fluctuatingIndicator.port';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { FluctuatingIndicatorMapper } from '../../../../building-blocks/mapper/fluctuatingIndicator.mapper';

@Injectable()
export class FluctuatingIndicatorRedisAdapter
  implements LoadCachedFluctuatingIndicatorPort, CachingFluctuatingIndicatorPort
{
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async loadCachedFluctuatingIndicator(ticker: string): Promise<FluctuatingIndicatorsDto | null> {
    const data: string = await this.redis.get(ticker);
    return data && FluctuatingIndicatorMapper.mapToDto(data);
  }

  async cachingFluctuatingIndicator(ticker: string, fluctuatingIndicatorsDto: FluctuatingIndicatorsDto): Promise<void> {
    const value: string = JSON.stringify(fluctuatingIndicatorsDto);
    this.redis.set(ticker, value);
    this.redis.expire(ticker, 10); // 변경가능
  }
}
