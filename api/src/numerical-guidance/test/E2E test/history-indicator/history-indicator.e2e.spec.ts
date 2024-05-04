import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IndicatorEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { MemberEntity } from '../../../../auth/entity/member.entity';
import { HistoryIndicatorEntity } from '../../../infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import * as fs from 'fs';
import { HistoryIndicatorValueEntity } from '../../../infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';
import { CustomForecastIndicatorEntity } from '../../../infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { HistoryIndicatorController } from '../../../api/history-indicator/history-indicator.controller';
import { AdjustIndicatorValue } from '../../../util/adjust-indicator-value';
import { AuthService } from '../../../../auth/application/auth.service';
import { GetHistoryIndicatorQueryHandler } from '../../../application/query/history-indicator/get-history-indicator/get-history-indicator.query.handler';
import { AuthGuard } from '../../../../auth/util/auth.guard';
import { of } from 'rxjs';
import { HttpExceptionFilter } from '../../../../utils/exception-filter/http-exception-filter';
import * as request from 'supertest';
import { HistoryIndicatorPersistentAdapter } from '../../../infrastructure/adapter/persistence/history-indicator/history-indicator.persistent.adapter';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('History Indicator E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;

  const seeding = async () => {
    const memberEntity = dataSource.getRepository(MemberEntity);
    await memberEntity.insert({ id: 1 });

    const indicatorEntity = dataSource.getRepository(IndicatorEntity);
    await indicatorEntity.insert({
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      name: '삼성전자',
      ticker: '005930',
      type: 'stocks',
      exchange: 'KOSPI',
    });

    const indicatorEntityByTicker = await dataSource.getRepository(IndicatorEntity).findOneBy({ ticker: '005930' });
    await dataSource.getRepository(HistoryIndicatorEntity).insert({
      id: indicatorEntityByTicker.id,
      name: indicatorEntityByTicker.name,
      type: indicatorEntityByTicker.type,
      ticker: indicatorEntityByTicker.ticker,
      exchange: indicatorEntityByTicker.exchange,
      values: [],
    });

    const historyIndicatorEntity: HistoryIndicatorEntity = await dataSource
      .getRepository(HistoryIndicatorEntity)
      .findOneBy({ id: indicatorEntityByTicker.id });

    const filePath = './src/numerical-guidance/test/data/history-indicator.json';

    const data = fs.readFileSync(filePath, 'utf8');

    const mockHistoryIndicatorValues = JSON.parse(data);
    const historyIndicatorValues = mockHistoryIndicatorValues.map((value) => {
      return {
        date: new Date(value.date),
        close: value.close,
        compare: value.compare,
        fluctuation: value.fluctuation,
        open: value.open,
        high: value.high,
        low: value.low,
        volume: value.volume,
        tradingValue: value.tradingValue,
        marketCapitalization: value.marketCapitalization,
        outstandingShares: value.outstandingShares,
      };
    });
    await dataSource.getRepository(HistoryIndicatorValueEntity).insert(historyIndicatorValues);
    const historyIndicatorValueEntities = await dataSource.getRepository(HistoryIndicatorValueEntity).find();
    historyIndicatorValueEntities.forEach((entity) => {
      entity.historyIndicator = historyIndicatorEntity;
    });
    await dataSource.getRepository(HistoryIndicatorValueEntity).save(historyIndicatorValueEntities);
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
          TypeOrmModule.forFeature([MemberEntity, HistoryIndicatorEntity, HistoryIndicatorValueEntity]),
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
                MemberEntity,
                IndicatorEntity,
                HistoryIndicatorEntity,
                HistoryIndicatorValueEntity,
                CustomForecastIndicatorEntity,
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
        controllers: [HistoryIndicatorController],
        providers: [
          AdjustIndicatorValue,
          AuthService,
          GetHistoryIndicatorQueryHandler,
          {
            provide: 'LoadHistoryIndicatorPort',
            useClass: HistoryIndicatorPersistentAdapter,
          },
          {
            provide: 'IndicatorValueManager',
            useClass: AdjustIndicatorValue,
          },
          {
            provide: AuthGuard,
            useValue: {
              canActivate: jest.fn().mockImplementation((context) => {
                const request = context.switchToHttp().getRequest();
                const member: MemberEntity = { id: 1 };
                request.member = member;
                return of(true);
              }),
            },
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
    app.useGlobalGuards(new AuthGuard());
    await app.init();
  }, 30000);

  afterAll(async () => {
    await DBenvironment.stop();
    await app.close();
  });

  it('/get history 지표 값을 불러온다.', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicators/history`)
      .query({
        indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
        interval: 'day',
        dataCount: 19,
        endDate: '20240227',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });
});
