import { Module } from '@nestjs/common';
import { NumericalGuidanceController } from './infrastructure/api/numerical-guidance.controller';
import { GetFluctuatingIndicatorsQueryHandler } from './application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query.handler';
import { FluctuatingIndicatorRedisAdapter } from './infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { FluctuatingIndicatorKrxAdapter } from './infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { GetFluctuatingIndicatorWithoutCacheQueryHandler } from './application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicator-without-cache.query.handler';
import { GetIndicatorListQueryHandler } from './application/query/get-indicator-list/get-indicator-list.query.handler';
import { IndicatorListAdapter } from './infrastructure/adapter/indicator-list/indicator-list.adapter';

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [NumericalGuidanceController],
  providers: [
    GetFluctuatingIndicatorsQueryHandler,
    GetFluctuatingIndicatorWithoutCacheQueryHandler,
    GetIndicatorListQueryHandler,
    {
      provide: 'LoadCachedFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorRedisAdapter,
    },
    {
      provide: 'LoadFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorKrxAdapter,
    },
    {
      provide: 'CachingFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorRedisAdapter,
    },
    {
      provide: 'LoadIndicatorListPort',
      useClass: IndicatorListAdapter,
    },
  ],
})
export class NumericalGuidanceModule {}
