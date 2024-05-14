import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisHealthModule } from '@nestjs-modules/ioredis';
import { MyRedisController } from './redis.controller';

@Module({
  imports: [TerminusModule, RedisHealthModule],
  controllers: [MyRedisController],
})
export class MyRedisModule {}
