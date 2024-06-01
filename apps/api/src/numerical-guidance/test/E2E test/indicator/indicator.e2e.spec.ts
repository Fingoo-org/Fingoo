import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { StockEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { IndicatorController } from '../../../api/indicator/indicator.controller';
import { IndicatorEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { BondsEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { IndicatorPersistentAdapter } from '../../../infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { HttpExceptionFilter } from '../../../../utils/exception-filter/http-exception-filter';
import * as request from 'supertest';
import * as fs from 'fs';
import { GetIndicatorListQueryHandler } from '../../../application/query/indicator/get-indicator-list/get-indicator-list.query.handler';
import { SearchTwelveIndicatorQueryHandler } from '../../../application/query/indicator/search-twelve-indicator/search-twelve-indicator.query.handler';
import { IndicatorTwelveAdapter } from '../../../infrastructure/adapter/twelve/indicator.twelve.adapter';
import { TwelveApiManager } from '../../../infrastructure/adapter/twelve/util/twelve-api.manager';
import { AdjustIndicatorValue } from '../../../util/adjust-indicator-value';
import { SearchIndicatorQueryHandler } from 'src/numerical-guidance/application/query/indicator/search-indicator/search-indicator.query.handler';
import { EconomyEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/economy.entity';
import { FredApiManager } from '../../../infrastructure/adapter/fred/util/fred-api.manager';

const filePath = './src/numerical-guidance/test/data/indicator-list-stocks.json';
const data = fs.readFileSync(filePath, 'utf8');
const testIndicatorList = JSON.parse(data);

describe('Indicator E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;

  const seeding = async () => {
    const stockEntityRepository = dataSource.getRepository(StockEntity);
    await stockEntityRepository.clear();
    await stockEntityRepository.insert(testIndicatorList);
    await stockEntityRepository.insert({
      id: '34bcb58c-1ea6-44a5-bb6a-dcd8929ab2b6',
      index: 1,
      indicatorType: 'stocks',
      symbol: 'validSymbol',
      name: 'search test indicator',
      country: 'South Korea',
      currency: 'KRW',
      exchange: 'KRX',
      mic_code: 'XKRX',
      type: 'Common Stock',
    });
    await stockEntityRepository.insert({
      id: 'b812be36-bba7-4341-89e6-2e23617ba0b0',
      index: 2,
      indicatorType: 'stocks',
      symbol: '000',
      name: 'Greenvolt - Energias Renovaveis SA',
      country: 'Germany',
      currency: 'EUR',
      exchange: 'XDUS',
      mic_code: 'XDUS',
      type: 'Common Stock',
    });
  };

  beforeAll(async () => {
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
        ],
        controllers: [IndicatorController],
        providers: [
          GetIndicatorListQueryHandler,
          SearchTwelveIndicatorQueryHandler,
          SearchIndicatorQueryHandler,
          TwelveApiManager,
          FredApiManager,
          {
            provide: 'LoadIndicatorPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'LoadIndicatorsPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'LoadIndicatorListPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'SearchIndicatorBySymbolPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'SearchIndicatorByTypeAndSymbolPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'SearchTwelveIndicatorPort',
            useClass: IndicatorTwelveAdapter,
          },
          {
            provide: 'SaveIndicatorListPort',
            useValue: {
              saveIndicatorList: jest.fn().mockImplementation(() => {}),
            },
          },
          {
            provide: 'SearchEconomyIndicatorPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'IndicatorValueManager',
            useClass: AdjustIndicatorValue,
          },
        ],
      }).compile(),
    ]);
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
    await DBenvironment.stop();
    await app.close();
  });

  it('/get 지표 List를 불러온다.', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicator/list`)
      .query({
        type: 'stocks',
        cursorToken: 1,
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get 지표 symbol을 검색한다. - twelve', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicator/twelve/search`)
      .query({
        symbol: '0',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get symbol로 지표를 검색한다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator/search')
      .query({
        symbol: '000',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get type, symbol로 지표들을 검색한다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator/search')
      .query({
        symbol: 'AA',
        type: 'stocks',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get type, symbol로 지표들을 검색한다. - economy', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator/search')
      .query({
        symbol: 'BOPBCA',
        type: 'economy',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get symbol로 지표를 검색한다. - symbol을 찾지 못한 경우', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator/search')
      .query({
        symbol: 'AA',
        type: 'invalidType',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});
