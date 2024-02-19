import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NumericalGuidanceController } from '../../api/numerical-guidance.controller';
import { GetIndicatorBoardMetaDataQueryHandler } from 'src/numerical-guidance/application/query/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { IndicatorBoardMetadataPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator-board-metadata.persistent.adapter';
import { HttpExceptionFilter } from 'src/utils/exception-filter/http-execption-filter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from 'src/auth/member.entity';
import { IndicatorBoardMetadataEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/entity/indicator-board-metadata.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AuthService } from 'src/auth/auth.service';
import { DataSource } from 'typeorm';
import { InsertIndicatorTickerCommandHandler } from '../../application/command/insert-indicator-ticker/insert-indicator-ticker.command.handler';
import { DeleteIndicatorTickerCommandHandler } from '../../application/command/delete-indicator-ticker/delete-indicator-ticker.command.handler';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('NumericalGuidance E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let environment;
  const seeding = async () => {
    const indicatorBoardMetaDataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetaDataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      indicatorBoardMetaDataName: 'name',
      tickers: { 'k-stock': ['ticker1'], exchange: [] },
    });
    indicatorBoardMetaDataRepository.save;

    await indicatorBoardMetaDataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
      indicatorBoardMetaDataName: 'name',
      tickers: { 'k-stock': ['ticker1'], exchange: [] },
    });
    indicatorBoardMetaDataRepository.save;
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [
          CqrsModule,
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          TypeOrmModule.forFeature([MemberEntity, IndicatorBoardMetadataEntity]),
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
              type: 'postgres',
              retryAttempts: 20,
              retryDelay: 5000,
              host: environment.getHost(),
              port: environment.getPort(),
              username: environment.getUsername(),
              password: environment.getPassword(),
              database: environment.getDatabase(),
              entities: [IndicatorBoardMetadataEntity, MemberEntity],
              synchronize: true,
            }),
          }),
        ],
        controllers: [NumericalGuidanceController],
        providers: [
          AuthService,
          GetIndicatorBoardMetaDataQueryHandler,
          InsertIndicatorTickerCommandHandler,
          DeleteIndicatorTickerCommandHandler,
          {
            provide: 'CreateIndicatorBoardMetadataPort',
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
            provide: 'DeleteIndicatorTickerPort',
            useClass: IndicatorBoardMetadataPersistentAdapter,
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
    await environment.stop();
    await app.close();
  });

  it('/get 메타데이터 id를 전송해서 id에 해당하는 메타데이터를 가져온다.', async () => {
    return request(app.getHttpServer())
      .get(`/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba73`)
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get db에 존재하지않는 메타데이터 id를 전송한다.', () => {
    return request(app.getHttpServer())
      .get('/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba22')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/post 지표보드 메타데이터에 새로운 지표를 추가한다.', async () => {
    return request(app.getHttpServer())
      .post(`/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        ticker: 'ticker2',
        type: 'k-stock',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 지표보드 메타데이터에 새로운 지표를 추가할 때 중복 데이터를 넣는다', async () => {
    return request(app.getHttpServer())
      .post(`/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        ticker: 'ticker1',
        type: 'k-stock',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/delete 지표보드 메타데이터에서 지표를 삭제한다.', async () => {
    return request(app.getHttpServer())
      .delete(`/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/indicator/ticker1`)
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 지표보드 메타데이터에서 지표를 삭제할 때, tickers에 존재하지 않는 값을 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete(
        `/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/indicator/invalidTicker`,
      )
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});
