import { Module } from '@nestjs/common';
import { NumericalGuidanceController } from './infrastructure/api/numerical-guidance.controller';
import { GetFluctuatingIndicatorsQueryHandler } from './application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query.handler';
import { FluctuatingIndicatorRedisAdapter } from './infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { FluctuatingIndicatorKrxAdapter } from './infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { GetFluctuatingIndicatorsWithoutCacheQueryHandler } from './application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicator-without-cache.query.handler';

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [NumericalGuidanceController],
  providers: [
    GetFluctuatingIndicatorsQueryHandler,
    GetFluctuatingIndicatorsWithoutCacheQueryHandler,
    {
      provide: 'LoadCachedFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorRedisAdapter,
    },
    {
      provide: 'LoadFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorKrxAdapter,
    },
    {
      provide: 'LoadFluctuatingIndicatorWithoutCachePort',
      useClass: FluctuatingIndicatorKrxAdapter,
    },
    {
      provide: 'CachingFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorRedisAdapter,
    },
  ],
})
export class NumericalGuidanceModule {}
