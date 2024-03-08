import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NumericalGuidanceController } from '../../api/numerical-guidance.controller';
import { GetIndicatorBoardMetadataQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { IndicatorBoardMetadataPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { HttpExceptionFilter } from 'src/utils/exception-filter/http-exception-filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/auth/member.entity';
import { IndicatorBoardMetadataEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';
import { InsertIndicatorIdCommandHandler } from '../../application/command/insert-indicator-id/insert-indicator-id.command.handler';
import { GetIndicatorBoardMetadataListQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query.handler';
import { DeleteIndicatorIdCommandHandler } from '../../application/command/delete-indicator-id/delete-indicator-id.command.handler';
import { DeleteIndicatorBoardMetadataCommandHandler } from '../../application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from '../../application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { AuthGuard } from '../../../auth/auth.guard';
import { of } from 'rxjs';
import { GetLiveIndicatorQueryHandler } from '../../application/query/get-live-indicator/get-live-indicator.query.handler';
import { FluctuatingIndicatorRedisAdapter } from '../../infrastructure/adapter/redis/fluctuatingIndicator.redis.adapter';
import { FluctuatingIndicatorKrxAdapter } from '../../infrastructure/adapter/krx/fluctuatingIndicator.krx.adapter';
import { HttpModule } from '@nestjs/axios';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisContainer } from '@testcontainers/redis';
import { IndicatorEntity } from '../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { IndicatorPersistentAdapter } from '../../infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { GetHistoryIndicatorQueryHandler } from '../../application/query/get-history-indicator/get-history-indicator.query.handler';
import { AdjustIndicatorValue } from '../../util/adjust-indicator-value';
import { HistoryIndicatorPersistentAdapter } from '../../infrastructure/adapter/persistence/history-indicator/history-indicator.persistent.adapter';
import { HistoryIndicatorEntity } from '../../infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import { HistoryIndicatorValueEntity } from '../../infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';
import * as fs from 'fs';
import { CreateCustomForecastIndicatorCommandHandler } from 'src/numerical-guidance/application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { GetCustomForecastIndicatorQueryHandler } from 'src/numerical-guidance/application/query/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';
import { CustomForecastIndicatorPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/custom-forecast-indicator/custom-forecast-indicator.persistent.adapter';
import { CustomForecastIndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('NumericalGuidance E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;
  let redisEnvironment;
  let fluctuatingIndicatorRedisAdapter: FluctuatingIndicatorRedisAdapter;

  const seeding = async () => {
    const indicatorEntity = dataSource.getRepository(IndicatorEntity);
    await indicatorEntity.insert({
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      name: '삼성전자',
      ticker: '005930',
      type: 'k-stock',
      market: 'KOSPI',
    });
    indicatorEntity.save;

    const memberEntity = dataSource.getRepository(MemberEntity);
    await memberEntity.insert({ id: 10 });
    memberEntity.save;

    await memberEntity.insert({ id: 1 });
    memberEntity.save;

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: ['indicatorId1'] },
      member: { id: 10 },
    });
    indicatorBoardMetadataRepository.save;

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: ['indicatorId1'] },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });
    indicatorBoardMetadataRepository.save;

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba50',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: ['indicatorId1'] },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });
    indicatorBoardMetadataRepository.save;

    const indicatorEntityByTicker = await dataSource.getRepository(IndicatorEntity).findOneBy({ ticker: '005930' });

    await dataSource.getRepository(HistoryIndicatorEntity).insert({
      id: indicatorEntityByTicker.id,
      name: indicatorEntityByTicker.name,
      type: indicatorEntityByTicker.type,
      ticker: indicatorEntityByTicker.ticker,
      market: indicatorEntityByTicker.market,
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

    const customForecastIndicatorEntity = dataSource.getRepository(CustomForecastIndicatorEntity);
    await customForecastIndicatorEntity.insert({
      id: 'f5206520-da94-11ee-b91b-3551e6db3bbd',
      customForecastIndicatorName: 'my second custom forecast indicators',
      type: 'customForecastIndicator',
      targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
      grangerVerification: [],
      cointJohansenVerification: [],
      sourceIndicatorIdsAndWeights: [],
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });
    customForecastIndicatorEntity.save;
  };

  beforeAll(async () => {
    DBenvironment = await new PostgreSqlContainer().start();
    redisEnvironment = await new RedisContainer().start();
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [
          CqrsModule,
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          TypeOrmModule.forFeature([
            MemberEntity,
            IndicatorBoardMetadataEntity,
            IndicatorEntity,
            HistoryIndicatorEntity,
            HistoryIndicatorValueEntity,
            CustomForecastIndicatorEntity,
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
                IndicatorBoardMetadataEntity,
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
          RedisModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: () => ({
              type: 'single',
              url: redisEnvironment.getConnectionUrl(),
            }),
          }),
        ],
        controllers: [NumericalGuidanceController],
        providers: [
          AdjustIndicatorValue,
          AuthService,
          GetLiveIndicatorQueryHandler,
          GetHistoryIndicatorQueryHandler,
          GetIndicatorBoardMetadataQueryHandler,
          InsertIndicatorIdCommandHandler,
          GetIndicatorBoardMetadataListQueryHandler,
          DeleteIndicatorIdCommandHandler,
          DeleteIndicatorBoardMetadataCommandHandler,
          UpdateIndicatorBoardMetadataNameCommandHandler,
          FluctuatingIndicatorRedisAdapter,
          CreateCustomForecastIndicatorCommandHandler,
          GetCustomForecastIndicatorQueryHandler,
          {
            provide: 'LoadCachedFluctuatingIndicatorPort',
            useClass: FluctuatingIndicatorRedisAdapter,
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
            provide: 'LoadIndicatorsPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: 'LoadIndicatorPort',
            useClass: IndicatorPersistentAdapter,
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
    fluctuatingIndicatorRedisAdapter = module.get(FluctuatingIndicatorRedisAdapter);
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
    await redisEnvironment.stop();
    await fluctuatingIndicatorRedisAdapter.disconnectRedis();
    await app.close();
  });

  it('/get live 지표 값을 불러온다.', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicators/live`)
      .query({
        indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
        interval: 'day',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
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

  it('/get 메타데이터 id를 전송해서 id에 해당하는 메타데이터를 가져온다.', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba73`)
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get db에 존재하지않는 메타데이터 id를 전송한다.', () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba22')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/post 지표보드 메타데이터에 새로운 지표를 추가한다.', async () => {
    return request(app.getHttpServer())
      .post(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        indicatorId: 'a79eface-1fd3-4b85-92ae-9628d37951fb',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 지표보드 메타데이터에 새로운 지표를 추가할 때 중복 데이터를 넣는다', async () => {
    return request(app.getHttpServer())
      .post(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        indicatorId: 'indicatorId1',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/get 사용자 id를 전송하여 메타데이터 리스트를 가져온다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator-board-metadata')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 지표보드 메타데이터에서 지표를 삭제한다.', async () => {
    return request(app.getHttpServer())
      .delete(
        '/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/indicator/a79eface-1fd3-4b85-92ae-9628d37951fb',
      )
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 지표보드 메타데이터에서 지표를 삭제할 때, indicatorIds 에 존재하지 않는 값을 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete(
        `/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/indicator/invalidId`,
      )
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/delete 지표보드 메타데이터에서 지표를 삭제할 때, 존재하지 않는 지표보드 메타데이터를 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete(`/api/numerical-guidance/indicator-board-metadata/e46240d3-7d15-48e7-a9b7-f490bf9ca6e0/indicator/ticker1`)
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/delete 지표보드 메타데이터를 삭제한다.', async () => {
    return request(app.getHttpServer())
      .delete(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 지표보드 메타데이터를 삭제할 때, 존재하지 않는 id를 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete(`/api/numerical-guidance/indicator-board-metadata/e46240d3-7d15-48e7-a9b7-f490bf9ca6e0`)
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/patch 지표보드 메타데이터의 이름을 수정한다.', async () => {
    return request(app.getHttpServer())
      .patch(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba50`)
      .send({
        name: 'updateName',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/patch 지표보드 메타데이터의 이름을 수정할 때, 이름이 빈값으로 들어온다.', async () => {
    return request(app.getHttpServer())
      .patch(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba50`)
      .send({
        name: '',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('예측 지표를 생성한다.', async () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/custom-forecast-indicator')
      .send({
        customForecastIndicatorName: '예측지표',
        targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('예측 지표 id로 예측지표를 불러온다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/custom-forecast-indicator/f5206520-da94-11ee-b91b-3551e6db3bbd')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });
});
