import { Module } from '@nestjs/common';
import { NumericalGuidanceController } from './api/numerical-guidance.controller';
import { GetFluctuatingIndicatorQueryHandler } from './application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query.handler';
import { FluctuatingIndicatorRedisAdapter } from './infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { FluctuatingIndicatorKrxAdapter } from './infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { GetIndicatorsQueryHandler } from './application/query/get-indicator/get-indicators.query.handler';
import { IndicatorPersistentAdapter } from './infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { GetFluctuatingIndicatorWithoutCacheQueryHandler } from './application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query.handler';
import { CreateIndicatorBoardMetadataCommandHandler } from './application/command/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { IndicatorBoardMetadataPersistentAdapter } from './infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadataEntity } from './infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { AuthService } from '../auth/auth.service';
import { MemberEntity } from '../auth/member.entity';
import { GetIndicatorBoardMetaDataQueryHandler } from './application/query/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { InsertIndicatorIdCommandHandler } from './application/command/insert-indicator-id/insert-indicator-id.command.handler';
import { GetIndicatorBoardMetadataListQueryHandler } from './application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query.handler';
import { DeleteIndicatorIdCommandHandler } from './application/command/delete-indicator-id/delete-indicator-id.command.handler';
import { DeleteIndicatorBoardMetadataCommandHandler } from './application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from './application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { GetLiveIndicatorQueryHandler } from './application/query/get-live-indicator/get-live-indicator.query.handler';
import { IndicatorEntity } from './infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { GetHistoryIndicatorQueryHandler } from './application/query/get-history-indicator/get-history-indicator.query.handler';
import { HistoryIndicatorPersistentAdapter } from './infrastructure/adapter/persistence/history-indicator/history-indicator.persistent.adapter';
import { HistoryIndicatorValueEntity } from './infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';
import { HistoryIndicatorEntity } from './infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import { AdjustIndicatorValue } from './util/adjust-indicator-value';
import { CreateCustomForecastIndicatorCommandHandler } from './application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { CustomForecastIndicatorPersistentAdapter } from './infrastructure/adapter/persistence/custom-forecast-indicator/custom-forecast-indicator.persistent.adapter';
import { CustomForecastIndicatorEntity } from './infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
    TypeOrmModule.forFeature([
      IndicatorBoardMetadataEntity,
      MemberEntity,
      IndicatorEntity,
      HistoryIndicatorEntity,
      HistoryIndicatorValueEntity,
      CustomForecastIndicatorEntity,
    ]),
  ],
  controllers: [NumericalGuidanceController],
  providers: [
    AdjustIndicatorValue,
    AuthService,
    GetFluctuatingIndicatorQueryHandler,
    GetLiveIndicatorQueryHandler,
    GetHistoryIndicatorQueryHandler,
    GetFluctuatingIndicatorWithoutCacheQueryHandler,
    GetIndicatorsQueryHandler,
    CreateIndicatorBoardMetadataCommandHandler,
    GetIndicatorBoardMetaDataQueryHandler,
    InsertIndicatorIdCommandHandler,
    GetIndicatorBoardMetadataListQueryHandler,
    DeleteIndicatorIdCommandHandler,
    DeleteIndicatorBoardMetadataCommandHandler,
    UpdateIndicatorBoardMetadataNameCommandHandler,
    CreateCustomForecastIndicatorCommandHandler,
    {
      provide: 'LoadCachedFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorRedisAdapter,
    },
    {
      provide: 'LoadFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorKrxAdapter,
    },
    {
      provide: 'LoadLiveIndicatorPort',
      useClass: FluctuatingIndicatorKrxAdapter,
    },
    {
      provide: 'LoadHistoryIndicatorPort',
      useClass: HistoryIndicatorPersistentAdapter,
    },
    {
      provide: 'CachingFluctuatingIndicatorPort',
      useClass: FluctuatingIndicatorRedisAdapter,
    },
    {
      provide: 'LoadIndicatorsPort',
      useClass: IndicatorPersistentAdapter,
    },
    {
      provide: 'LoadIndicatorPort',
      useClass: IndicatorPersistentAdapter,
    },
    {
      provide: 'CreateIndicatorBoardMetaDataPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'LoadIndicatorBoardMetadataPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'InsertIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'LoadIndicatorBoardMetadataListPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteIndicatorBoardMetadataPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'UpdateIndicatorBoardMetadataNamePort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'IndicatorValueManager',
      useClass: AdjustIndicatorValue,
    },
    {
      provide: 'CreateCustomForecastIndicatorPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
  ],
})
export class NumericalGuidanceModule {}
