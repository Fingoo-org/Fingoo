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
import { CreateIndicatorBoardMetadataCommandHandler } from './application/command/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { IndicatorBoardMetadataPersistentAdapter } from './infrastructure/adapter/persistence/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadataEntity } from './infrastructure/adapter/persistence/entity/indicator-board-metadata.entity';
import { AuthService } from '../auth/auth.service';
import { MemberEntity } from '../auth/member.entity';
import { GetIndicatorBoardMetaDataQueryHandler } from './application/query/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { InsertIndicatorTickerCommandHandler } from './application/command/insert-indicator-ticker/insert-indicator-ticker.command.handler';
import { GetMemberIndicatorBoardMetadataListQueryHandler } from './application/query/get-user-indicator-board-metadata-list/get-member-indicator-board-metadata-list.query.handler';
import { DeleteIndicatorTickerCommandHandler } from './application/command/delete-indicator-ticker/delete-indicator-ticker.command.handler';
import { DeleteIndicatorBoardMetadataCommandHandler } from './application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from './application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { GetLiveIndicatorQueryHandler } from './application/query/get-live-indicator/get-live-indicator.query.handler';

@Module({
  imports: [
    CqrsModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 10000,
        maxRedirects: 5,
      }),
    }),
    TypeOrmModule.forFeature([IndicatorBoardMetadataEntity, MemberEntity]),
  ],
  controllers: [NumericalGuidanceController],
  providers: [
    AuthService,
    GetFluctuatingIndicatorQueryHandler,
    GetLiveIndicatorQueryHandler,
    GetFluctuatingIndicatorWithoutCacheQueryHandler,
    GetIndicatorListQueryHandler,
    CreateIndicatorBoardMetadataCommandHandler,
    GetIndicatorBoardMetaDataQueryHandler,
    InsertIndicatorTickerCommandHandler,
    GetMemberIndicatorBoardMetadataListQueryHandler,
    DeleteIndicatorTickerCommandHandler,
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
      provide: 'LoadIndicatorListPort',
      useClass: IndicatorListAdapter,
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
      provide: 'InsertIndicatorTickerPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'LoadMemberIndicatorBoardMetadataListPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteIndicatorTickerPort',
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
