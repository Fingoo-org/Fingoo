import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { LiveIndicatorRedisAdapter } from '../../../infrastructure/adapter/redis/live-indicator.redis.adapter';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LiveIndicatorController } from '../../../api/live-indicator/live-indicator.controller';
import { AdjustIndicatorValue } from '../../../util/adjust-indicator-value';
import { GetLiveIndicatorQueryHandler } from '../../../application/query/live-indicator/get-live-indicator/get-live-indicator.query.handler';
import { CustomAuthGuard } from '../../../../auth/util/custom-auth.guard';
import { HttpExceptionFilter } from '../../../../utils/exception-filter/http-exception-filter';
import { HttpModule } from '@nestjs/axios';
import { IndicatorPersistentAdapter } from '../../../infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisContainer } from '@testcontainers/redis';
import { DataSource } from 'typeorm';
import { BondsEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { StockEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { IndicatorTwelveAdapter } from '../../../infrastructure/adapter/twelve/indicator.twelve.adapter';
import { TwelveApiUtil } from '../../../infrastructure/adapter/twelve/util/twelve-api.util';
import * as request from 'supertest';

describe('Live Indicator E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;
  let redisEnvironment;
  let liveIndicatorRedisAdapter: LiveIndicatorRedisAdapter;

  const seeding = async () => {
    const stockRepository = dataSource.getRepository(StockEntity);
    stockRepository.insert({
      id: '5776afe3-6a3f-42e9-83ec-cb634b76f958',
      index: 1,
      symbol: 'AAPL',
      indicatorType: 'stocks',
      name: 'Apple Inc',
      currency: 'USD',
      exchange: 'NASDAQ',
      mic_code: 'XNGS',
      country: 'United States',
      type: 'Common Stock',
    });
  };

  beforeAll(async () => {
    redisEnvironment = await new RedisContainer().start();
    DBenvironment = await new PostgreSqlContainer().start();
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [
          CqrsModule,
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          TypeOrmModule.forFeature([
            IndicatorEntity,
            BondsEntity,
            CryptoCurrenciesEntity,
            ETFEntity,
            ForexPairEntity,
            FundEntity,
            IndicesEntity,
            StockEntity,
          ]),
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
              type: 'postgres',
              retryAttempts: 20,
              retryDelay: 5000,
              host: DBenvironment.getHost(),
              port: DBenvironment.getPort(),
              username: DBenvironment.getUsername(),
              password: DBenvironment.getPassword(),
              database: DBenvironment.getDatabase(),
              entities: [
                IndicatorEntity,
                BondsEntity,
                CryptoCurrenciesEntity,
                ETFEntity,
                ForexPairEntity,
                FundEntity,
                IndicesEntity,
                StockEntity,
              ],
              synchronize: true,
            }),
          }),
          HttpModule.registerAsync({
            useFactory: () => ({
              timeout: 10000,
              maxRedirects: 5,
            }),
          }),
          RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
              type: 'single',
              url: redisEnvironment.getConnectionUrl(),
            }),
          }),
        ],
        controllers: [LiveIndicatorController],
        providers: [
          AdjustIndicatorValue,
          GetLiveIndicatorQueryHandler,
          LiveIndicatorRedisAdapter,
          {
            provide: 'LoadCachedLiveIndicatorPort',
            useClass: LiveIndicatorRedisAdapter,
          },
          {
            provide: 'LoadLiveIndicatorPort',
            useClass: IndicatorTwelveAdapter,
          },
          {
            provide: 'CachingLiveIndicatorPort',
            useClass: LiveIndicatorRedisAdapter,
          },
          {
            provide: 'LoadIndicatorPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'LoadIndicatorListPort',
            useClass: IndicatorPersistentAdapter,
          },
          IndicatorTwelveAdapter,
          TwelveApiUtil,
          {
            provide: 'IndicatorValueManager',
            useClass: AdjustIndicatorValue,
          },
        ],
      }).compile(),
    ]);
    liveIndicatorRedisAdapter = module.get(LiveIndicatorRedisAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        disableErrorMessages: false,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalGuards(new CustomAuthGuard());
    await app.init();
  }, 30000);

  afterAll(async () => {
    await redisEnvironment.stop();
    await DBenvironment.stop();
    await liveIndicatorRedisAdapter.disconnectRedis();
    await app.close();
  });

  it('/get live 지표 값을 불러온다.', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicators/live`)
      .query({
        indicatorId: '5776afe3-6a3f-42e9-83ec-cb634b76f958',
        interval: 'day',
        indicatorType: 'stocks',
        startDate: '2024-02-11',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });
});
