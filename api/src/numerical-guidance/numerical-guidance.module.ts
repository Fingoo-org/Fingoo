import { Module } from '@nestjs/common';
import { NumericalGuidanceController } from './api/numerical-guidance.controller';
import { LiveIndicatorRedisAdapter } from './infrastructure/adapter/redis/live-indicator.redis.adapter';
import { LiveIndicatorKrxAdapter } from './infrastructure/adapter/krx/live-indicator.krx.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { GetIndicatorsQueryHandler } from './application/query/get-indicator/get-indicators.query.handler';
import { IndicatorPersistentAdapter } from './infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { CreateIndicatorBoardMetadataCommandHandler } from './application/command/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { IndicatorBoardMetadataPersistentAdapter } from './infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadataEntity } from './infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { AuthService } from '../auth/auth.service';
import { MemberEntity } from '../auth/member.entity';
import { GetIndicatorBoardMetadataQueryHandler } from './application/query/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
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
import { GetCustomForecastIndicatorQueryHandler } from './application/query/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';
import { GetCustomForecastIndicatorsByMemberIdQueryHandler } from './application/query/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query.handler';
import { UpdateSourceIndicatorsAndWeightsCommandHandler } from './application/command/update-source-indicators-and-weights/update-source-indicators-and-weights.command.handler';
import { GetCustomForecastIndicatorValuesQueryHandler } from './application/query/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query.handler';
import { InsertCustomForecastIndicatorIdCommandHandler } from './application/command/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command.handler';

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
    GetLiveIndicatorQueryHandler,
    GetHistoryIndicatorQueryHandler,
    GetIndicatorsQueryHandler,
    CreateIndicatorBoardMetadataCommandHandler,
    GetIndicatorBoardMetadataQueryHandler,
    InsertIndicatorIdCommandHandler,
    GetIndicatorBoardMetadataListQueryHandler,
    DeleteIndicatorIdCommandHandler,
    DeleteIndicatorBoardMetadataCommandHandler,
    UpdateIndicatorBoardMetadataNameCommandHandler,
    CreateCustomForecastIndicatorCommandHandler,
    GetCustomForecastIndicatorQueryHandler,
    GetCustomForecastIndicatorsByMemberIdQueryHandler,
    UpdateSourceIndicatorsAndWeightsCommandHandler,
    GetCustomForecastIndicatorValuesQueryHandler,
    InsertCustomForecastIndicatorIdCommandHandler,
    {
      provide: 'LoadCachedLiveIndicatorPort',
      useClass: LiveIndicatorRedisAdapter,
    },
    {
      provide: 'LoadLiveIndicatorPort',
      useClass: LiveIndicatorKrxAdapter,
    },
    {
      provide: 'LoadHistoryIndicatorPort',
      useClass: HistoryIndicatorPersistentAdapter,
    },
    {
      provide: 'CachingLiveIndicatorPort',
      useClass: LiveIndicatorRedisAdapter,
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
      provide: 'CreateIndicatorBoardMetadataPort',
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
    {
      provide: 'LoadCustomForecastIndicatorPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'LoadCustomForecastIndicatorsByMemberIdPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'UpdateSourceIndicatorsAndWeightsPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'LoadCustomForecastIndicatorValuesPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'InsertCustomForecastIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
  ],
})
export class NumericalGuidanceModule {}
