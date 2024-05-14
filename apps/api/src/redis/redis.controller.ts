import { Controller, Get, Post } from '@nestjs/common';
import { InjectRedis, RedisHealthIndicator } from '@nestjs-modules/ioredis';
import { HealthCheckService, HealthCheck, HealthCheckResult } from '@nestjs/terminus';
import { Redis } from 'ioredis';

@Controller('/redis')
export class MyRedisController {
  constructor(
    private health: HealthCheckService,
    private redisHealthIndicator: RedisHealthIndicator,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @Get('/health')
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([async () => this.redisHealthIndicator.isHealthy('redis')]);
  }

  @Get()
  async getRedis() {
    const redisData = await this.redis.get('key');
    return { redisData };
  }

  @Post()
  async registerRedis() {
    await this.redis.set('key', 'Redis data!');
    this.redis.expire('key', 10);
  }
}
