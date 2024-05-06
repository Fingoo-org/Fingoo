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
import { SearchIndicatorQueryHandler } from '../../../application/query/indicator/get-indicator-search/search-indicator.query.handler';
import { IndicatorTwelveAdapter } from '../../../infrastructure/adapter/twelve/indicator.twelve.adapter';
import { TwelveApiUtil } from '../../../infrastructure/adapter/twelve/util/twelve-api.util';
import { AdjustIndicatorValue } from '../../../util/adjust-indicator-value';
import { SearchIndicatorBySymbolQueryHandler } from 'src/numerical-guidance/application/query/indicator/get-search-indicator-by-symbol/search-indicator-by-symbol.query.handler';

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
        ],
        controllers: [IndicatorController],
        providers: [
          GetIndicatorListQueryHandler,
          SearchIndicatorQueryHandler,
          SearchIndicatorBySymbolQueryHandler,
          TwelveApiUtil,
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
            provide: 'SearchIndicatorPort',
            useClass: IndicatorTwelveAdapter,
          },
          {
            provide: 'SaveIndicatorListPort',
            useValue: {
              saveIndicatorList: jest.fn().mockImplementation(() => {}),
            },
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

  it('/get 지표 symbol을 검색한다.', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicator/search`)
      .query({
        symbol: 'AA',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get symbol로 지표를 검색한다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator/search-by-symbol/validSymbol')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get symbol로 지표를 검색한다. - symbol을 찾지 못한 경우', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator/search-by-symbol/invalidSymbol')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });
});
