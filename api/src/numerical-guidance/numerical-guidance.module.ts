import { Module } from '@nestjs/common';
import { LiveIndicatorRedisAdapter } from './infrastructure/adapter/redis/live-indicator.redis.adapter';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { IndicatorPersistentAdapter } from './infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { CreateIndicatorBoardMetadataCommandHandler } from './application/command/indicator-board-metadata/create-indicator-board-metadata/create-indicator-board-metadata.command.handler';
import { IndicatorBoardMetadataPersistentAdapter } from './infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadataEntity } from './infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { AuthService } from '../auth/auth.service';
import { MemberEntity } from '../auth/member.entity';
import { GetIndicatorBoardMetadataQueryHandler } from './application/query/indicator-board-metadata/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { InsertIndicatorIdCommandHandler } from './application/command/indicator/insert-indicator-id/insert-indicator-id.command.handler';
import { GetIndicatorBoardMetadataListQueryHandler } from './application/query/indicator-board-metadata/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query.handler';
import { DeleteIndicatorIdCommandHandler } from './application/command/indicator/delete-indicator-id/delete-indicator-id.command.handler';
import { DeleteIndicatorBoardMetadataCommandHandler } from './application/command/indicator-board-metadata/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from './application/command/indicator-board-metadata/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { GetLiveIndicatorQueryHandler } from './application/query/live-indicator/get-live-indicator/get-live-indicator.query.handler';
import { IndicatorEntity } from './infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { GetHistoryIndicatorQueryHandler } from './application/query/history-indicator/get-history-indicator/get-history-indicator.query.handler';
import { HistoryIndicatorPersistentAdapter } from './infrastructure/adapter/persistence/history-indicator/history-indicator.persistent.adapter';
import { HistoryIndicatorValueEntity } from './infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';
import { HistoryIndicatorEntity } from './infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import { AdjustIndicatorValue } from './util/adjust-indicator-value';
import { CreateCustomForecastIndicatorCommandHandler } from './application/command/custom-forecast-indicator/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { CustomForecastIndicatorPersistentAdapter } from './infrastructure/adapter/persistence/custom-forecast-indicator/custom-forecast-indicator.persistent.adapter';
import { CustomForecastIndicatorEntity } from './infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';
import { GetCustomForecastIndicatorQueryHandler } from './application/query/custom-forecast-indicator/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';
import { GetCustomForecastIndicatorsByMemberIdQueryHandler } from './application/query/custom-forecast-indicator/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query.handler';
import { UpdateSourceIndicatorsInformationCommandHandler } from './application/command/custom-forecast-indicator/update-source-indicators-and-weights/update-source-indicators-information.command.handler';
import { GetCustomForecastIndicatorValuesQueryHandler } from './application/query/custom-forecast-indicator/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query.handler';
import { InsertCustomForecastIndicatorIdCommandHandler } from './application/command/custom-forecast-indicator/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command.handler';
import { CustomForecastIndicatorController } from './api/custom-forecast-indicator/custom-forecast-indicator.controller';
import { HistoryIndicatorController } from './api/history-indicator/history-indicator.controller';
import { IndicatorController } from './api/indicator/indicator.controller';
import { IndicatorBoardMetadataController } from './api/indicator-board-metadata/indicator-board-metadata.controller';
import { LiveIndicatorController } from './api/live-indicator/live-indicator.controller';
import { DeleteCustomForecastIndicatorIdCommandHandler } from './application/command/custom-forecast-indicator/delete-custom-forecast-indicator-id/delete-custom-forecast-indicator-id.command.handler';
import { DeleteCustomForecastIndicatorCommandHandler } from './application/command/custom-forecast-indicator/delete-custom-forecast-indicator/delete-custom-forecast-indicator.command.handler';
import { UpdateCustomForecastIndicatorNameCommandHandler } from './application/command/custom-forecast-indicator/update-custom-forecast-indicator-name/update-custom-forecast-indicator-name.command.handler';
import { FileSupabaseAdapter } from './infrastructure/adapter/storage/file.supabase.adapter';
import { UploadFileCommandHandler } from './application/command/indicator-board-metadata/upload-file/upload-file.command.handler';
import { UpdateSectionsCommandHandler } from './application/command/indicator-board-metadata/update-sections/update-sections.command.handler';
import { GetIndicatorListQueryHandler } from './application/query/indicator/get-indicator-list/get-indicator-list.query.handler';
import { TwelveApiUtil } from './infrastructure/adapter/twelve/util/twelve-api.util';
import { BondsEntity } from './infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { IndicatorTwelveAdapter } from './infrastructure/adapter/twelve/indicator.twelve.adapter';
import { SaveIndicatorListCommandHandler } from './application/command/indicator/save-indicator-list/save-indicator-list.command.handler';
import { CryptoCurrenciesEntity } from './infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from './infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from './infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from './infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from './infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { StockEntity } from './infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { SearchIndicatorQueryHandler } from './application/query/indicator/get-indicator-search/search-indicator.query.handler';
import { SearchIndicatorBySymbolQueryHandler } from './application/query/indicator/get-search-indicator-by-symbol/search-indicator-by-symbol.query.handler';

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
      BondsEntity,
      CryptoCurrenciesEntity,
      ETFEntity,
      ForexPairEntity,
      FundEntity,
      IndicesEntity,
      StockEntity,
    ]),
  ],
  controllers: [
    CustomForecastIndicatorController,
    HistoryIndicatorController,
    IndicatorController,
    IndicatorBoardMetadataController,
    LiveIndicatorController,
  ],
  providers: [
    AdjustIndicatorValue,
    AuthService,
    GetLiveIndicatorQueryHandler,
    GetHistoryIndicatorQueryHandler,
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
    UpdateSourceIndicatorsInformationCommandHandler,
    GetCustomForecastIndicatorValuesQueryHandler,
    InsertCustomForecastIndicatorIdCommandHandler,
    DeleteCustomForecastIndicatorIdCommandHandler,
    DeleteCustomForecastIndicatorCommandHandler,
    UpdateCustomForecastIndicatorNameCommandHandler,
    UploadFileCommandHandler,
    UpdateSectionsCommandHandler,
    GetIndicatorListQueryHandler,
    SaveIndicatorListCommandHandler,
    SearchIndicatorQueryHandler,
    SearchIndicatorBySymbolQueryHandler,
    IndicatorTwelveAdapter,
    {
      provide: 'LoadCachedLiveIndicatorPort',
      useClass: LiveIndicatorRedisAdapter,
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
      provide: 'LoadIndicatorListPort',
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
      provide: 'UpdateSectionsPort',
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
      provide: 'UpdateSourceIndicatorsInformationPort',
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
    {
      provide: 'DeleteCustomForecastIndicatorIdPort',
      useClass: IndicatorBoardMetadataPersistentAdapter,
    },
    {
      provide: 'DeleteCustomForecastIndicatorPort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'UpdateCustomForecastIndicatorNamePort',
      useClass: CustomForecastIndicatorPersistentAdapter,
    },
    {
      provide: 'UploadFilePort',
      useClass: FileSupabaseAdapter,
    },
    {
      provide: 'SaveIndicatorListPort',
      useClass: IndicatorPersistentAdapter,
    },
    {
      provide: 'SearchIndicatorBySymbolPort',
      useClass: IndicatorPersistentAdapter,
    },
    {
      provide: 'SearchIndicatorPort',
      useClass: IndicatorTwelveAdapter,
    },
    {
      provide: 'LoadLiveIndicatorPort',
      useClass: IndicatorTwelveAdapter,
    },
    TwelveApiUtil,
  ],
})
export class NumericalGuidanceModule {}
