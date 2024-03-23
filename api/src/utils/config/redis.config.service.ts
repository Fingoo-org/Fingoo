import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisModuleOptionsFactory, RedisSingleOptions } from '@nestjs-modules/ioredis/dist/redis.interfaces';

@Injectable()
export class RedisConfigService implements RedisModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createRedisModuleOptions(): RedisSingleOptions {
    return {
      type: 'single',
      url: 'redis://redis:6379',
      options: {
        retryStrategy() {
          return 5000;
        },
      },
    };
  }
}
