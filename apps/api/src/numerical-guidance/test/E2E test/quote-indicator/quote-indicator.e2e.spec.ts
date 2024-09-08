import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { TwelveApiManager } from '../../../infrastructure/adapter/twelve/util/twelve-api.manager';
import { EconomyEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/economy.entity';
import { QuoteIndicatorRedisAdapter } from '../../../infrastructure/adapter/redis/quote-indicator.redis.adapter';
import { QuoteIndicatorController } from '../../../api/quote-indicator/quote-indicator.controller';
import { GetQuoteIndicatorQueryHandler } from '../../../application/query/quote-indicator/get-quote-indicator/get-quote-indicator.query.handler';
import { AdjustIndicatorValue } from '../../../util/adjust-indicator-value';
import { IndicatorFredAdapter } from '../../../infrastructure/adapter/fred/indicator.fred.adapter';
import { FredApiManager } from '../../../infrastructure/adapter/fred/util/fred-api.manager';

describe('Live Indicator E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;
  let redisEnvironment;
  let quoteIndicatorRedisAdapter: QuoteIndicatorRedisAdapter;

  const seeding = async () => {
    const stockRepository = dataSource.getRepository(StockEntity);
    await stockRepository.insert({
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
            EconomyEntity,
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
                EconomyEntity,
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
        controllers: [QuoteIndicatorController],
        providers: [
          AdjustIndicatorValue,
          GetQuoteIndicatorQueryHandler,
          QuoteIndicatorRedisAdapter,
          IndicatorFredAdapter,
          {
            provide: 'LoadCachedQuoteIndicatorPort',
            useClass: QuoteIndicatorRedisAdapter,
          },
          {
            provide: 'LoadQuoteIndicatorPort',
            useClass: IndicatorTwelveAdapter,
          },
          {
            provide: 'CachingQuoteIndicatorPort',
            useClass: QuoteIndicatorRedisAdapter,
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
            provide: 'IndicatorValueManager',
            useClass: AdjustIndicatorValue,
          },
          {
            provide: 'LoadLiveEconomyIndicatorPort',
            useClass: IndicatorFredAdapter,
          },
          IndicatorTwelveAdapter,
          TwelveApiManager,
          FredApiManager,
        ],
      }).compile(),
    ]);
    quoteIndicatorRedisAdapter = module.get(QuoteIndicatorRedisAdapter);
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
    await app.init();
  }, 30000);

  afterAll(async () => {
    await redisEnvironment.stop();
    await DBenvironment.stop();
    await quoteIndicatorRedisAdapter.disconnectRedis();
    await app.close();
  });

  it('/get quote 지표 값을 불러온다.', async () => {
    await request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicators/quote`)
      .query({
        indicatorId: '5776afe3-6a3f-42e9-83ec-cb634b76f958',
        interval: '1min',
        indicatorType: 'stocks',
        symbol: 'APPL',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get quote 지표 값을 불러온다. - Fingoo Server와 TwelveData Api Server 시간 동기화 문제', async () => {});
});
