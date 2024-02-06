import { Module } from '@nestjs/common';
import { NumericalGuidanceController } from './api/numerical-guidance.controller';
import { GetFluctuatingIndicatorQueryHandler } from './application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query.handler';
import { FluctuatingIndicatorRedisAdapter } from './infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { FluctuatingIndicatorKrxAdapter } from './infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { GetIndicatorListQueryHandler } from './application/query/get-indicator-list/get-indicator-list.query.handler';
import { IndicatorListAdapter } from './infrastructure/adapter/indicator-list/indicator-list.adapter';
import { GetFluctuatingIndicatorWithoutCacheQueryHandler } from './application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query.handler';
import { CreateIndicatorBoardMetaDataCommandHandler } from './application/command/create-indicator-board-meta-data/create-indicator-board-meta-data.command.handler';
import { IndicatorBoardMetaDataPersistentAdapter } from './infrastructure/adapter/persistence/indicator-board-meta-data.persistent.adapter';

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
    GetFluctuatingIndicatorQueryHandler,
    GetFluctuatingIndicatorWithoutCacheQueryHandler,
    GetIndicatorListQueryHandler,
    CreateIndicatorBoardMetaDataCommandHandler,
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
    {
      provide: 'CreateIndicatorBoardMetaDataPort',
      useClass: IndicatorBoardMetaDataPersistentAdapter,
    },
  ],
})
export class NumericalGuidanceModule {}
