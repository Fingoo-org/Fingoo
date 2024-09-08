import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

export class BaseRedisAdapter {
  constructor(@InjectRedis() protected readonly redis: Redis) {}

  async disconnectRedis() {
    this.redis.disconnect();
  }
}
