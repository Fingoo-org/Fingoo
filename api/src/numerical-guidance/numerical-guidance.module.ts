import { Module } from '@nestjs/common';
import { NumericalGuidanceController } from './infrastructure/api/numerical-guidance.controller';
import { GetFluctuatingIndicatorsQueryHandler } from './application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query.handler';
import { FluctuatingIndicatorRedisAdapter } from './infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { FluctuatingIndicatorKrxAdapter } from './infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';

@Module({
  imports: [NumericalGuidanceController],
  providers: [
    GetFluctuatingIndicatorsQueryHandler,
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
  ],
})
export class NumericalGuidanceModule {}
