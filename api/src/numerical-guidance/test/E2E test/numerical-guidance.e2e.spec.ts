import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NumericalGuidanceController } from '../../api/numerical-guidance.controller';
import { GetIndicatorBoardMetaDataQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { IndicatorBoardMetadataPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { HttpExceptionFilter } from 'src/utils/exception-filter/http-execption-filter';
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
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
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
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
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
          TypeOrmModule.forFeature([MemberEntity, IndicatorBoardMetadataEntity, IndicatorEntity]),
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
              entities: [IndicatorBoardMetadataEntity, MemberEntity, IndicatorEntity],
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
          AuthService,
          GetLiveIndicatorQueryHandler,
          GetIndicatorBoardMetaDataQueryHandler,
          InsertIndicatorIdCommandHandler,
          GetIndicatorBoardMetadataListQueryHandler,
          DeleteIndicatorIdCommandHandler,
          DeleteIndicatorBoardMetadataCommandHandler,
          UpdateIndicatorBoardMetadataNameCommandHandler,
          FluctuatingIndicatorRedisAdapter,
          {
            provide: 'LoadCachedFluctuatingIndicatorPort',
            useClass: FluctuatingIndicatorRedisAdapter,
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
      .get(`/api/numerical-guidance/indicators/k-stock/live`)
      .query({
        indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
        interval: 'day',
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
        indicatorId: 'indicatorId2',
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
        '/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/indicator/indicatorId2',
      )
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 지표보드 메타데이터에서 지표를 삭제할 때, tickers에 존재하지 않는 값을 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete(
        `/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/indicator/invalidTicker`,
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

  it('/delete 지표보드 메타데이터를 삭제할때, 존재하지 않는 id를 요청한다.', async () => {
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
});
