import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { LiveIndicatorRedisAdapter } from '../../../infrastructure/adapter/redis/live-indicator.redis.adapter';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LiveIndicatorController } from '../../../api/live-indicator/live-indicator.controller';
import { AdjustIndicatorValue } from '../../../util/adjust-indicator-value';
import { GetLiveIndicatorQueryHandler } from '../../../application/query/live-indicator/get-live-indicator/get-live-indicator.query.handler';
import { LiveIndicatorKrxAdapter } from '../../../infrastructure/adapter/krx/live-indicator.krx.adapter';
import { AuthGuard } from '../../../../auth/auth.guard';
import { HttpExceptionFilter } from '../../../../utils/exception-filter/http-exception-filter';
import * as request from 'supertest';
import { HttpModule } from '@nestjs/axios';
import { IndicatorPersistentAdapter } from '../../../infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisContainer } from '@testcontainers/redis';
import { DataSource } from 'typeorm';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('Live Indicator E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;
  let redisEnvironment;
  let liveIndicatorRedisAdapter: LiveIndicatorRedisAdapter;

  const seeding = async () => {
    const indicatorEntity = dataSource.getRepository(IndicatorEntity);
    await indicatorEntity.insert({
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      name: '삼성전자',
      ticker: '005930',
      type: 'k-stock',
      market: 'KOSPI',
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
          TypeOrmModule.forFeature([IndicatorEntity]),
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
              entities: [IndicatorEntity],
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
            useClass: LiveIndicatorKrxAdapter,
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
    app.useGlobalGuards(new AuthGuard());
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
        indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
        interval: 'day',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });
});
