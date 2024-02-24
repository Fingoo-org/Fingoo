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
import { GetMemberIndicatorBoardMetadataListQueryHandler } from './application/query/get-member-indicator-board-metadata-list/get-member-indicator-board-metadata-list.query.handler';
import { DeleteIndicatorIdCommandHandler } from './application/command/delete-indicator-id/delete-indicator-id.command.handler';
import { DeleteIndicatorBoardMetadataCommandHandler } from './application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from './application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { GetLiveIndicatorQueryHandler } from './application/query/get-live-indicator/get-live-indicator.query.handler';
import { IndicatorEntity } from './infrastructure/adapter/persistence/indicator/entity/indicator.entity';

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
    TypeOrmModule.forFeature([IndicatorBoardMetadataEntity, MemberEntity, IndicatorEntity]),
  ],
  controllers: [NumericalGuidanceController],
  providers: [
    AuthService,
    GetFluctuatingIndicatorQueryHandler,
    GetLiveIndicatorQueryHandler,
    GetFluctuatingIndicatorWithoutCacheQueryHandler,
    GetIndicatorsQueryHandler,
    CreateIndicatorBoardMetadataCommandHandler,
    GetIndicatorBoardMetaDataQueryHandler,
    InsertIndicatorIdCommandHandler,
    GetMemberIndicatorBoardMetadataListQueryHandler,
    DeleteIndicatorIdCommandHandler,
    DeleteIndicatorBoardMetadataCommandHandler,
    UpdateIndicatorBoardMetadataNameCommandHandler,
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
      provide: 'LoadMemberIndicatorBoardMetadataListPort',
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
  ],
})
export class NumericalGuidanceModule {}
