import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MemberEntity } from '../../../../auth/member.entity';
import { IndicatorBoardMetadataEntity } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { CustomForecastIndicatorEntity } from '../../../infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CustomForecastIndicatorController } from '../../../api/custom-forecast-indicator/custom-forecast-indicator.controller';
import { AuthService } from '../../../../auth/auth.service';
import { InsertCustomForecastIndicatorIdCommandHandler } from '../../../application/command/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command.handler';
import { CreateCustomForecastIndicatorCommandHandler } from '../../../application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { GetCustomForecastIndicatorQueryHandler } from '../../../application/query/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';
import { GetCustomForecastIndicatorsByMemberIdQueryHandler } from '../../../application/query/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query.handler';
import { IndicatorBoardMetadataPersistentAdapter } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { CustomForecastIndicatorPersistentAdapter } from '../../../infrastructure/adapter/persistence/custom-forecast-indicator/custom-forecast-indicator.persistent.adapter';
import { AuthGuard } from '../../../../auth/auth.guard';
import { of } from 'rxjs';
import { HttpExceptionFilter } from '../../../../utils/exception-filter/http-exception-filter';
import * as request from 'supertest';
import { DeleteCustomForecastIndicatorCommandHandler } from 'src/numerical-guidance/application/command/delete-custom-forecast-indicator/delete-custom-forecast-indicator.command.handler';
import { UpdateCustomForecastIndicatorNameCommandHandler } from 'src/numerical-guidance/application/command/update-custom-forecast-indicator-name/update-custom-forecast-indicator-name.command.handler';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('Customer Forecast Indicator E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;

  const seeding = async () => {
    const memberEntity = dataSource.getRepository(MemberEntity);
    await memberEntity.insert({ id: 1 });

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba99',
      indicatorBoardMetadataName: '예측지표추가 테스트용 메타데이터',
      indicatorIds: { indicatorIds: [] },
      customForecastIndicatorIds: { customForecastIndicatorIds: [] },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
      member: { id: 1 },
    });

    const customForecastIndicatorEntity = dataSource.getRepository(CustomForecastIndicatorEntity);
    await customForecastIndicatorEntity.insert({
      id: 'f5206520-da94-11ee-b91b-3551e6db3bbd',
      customForecastIndicatorName: 'my second custom forecast indicators',
      type: 'customForecastIndicator',
      targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
      grangerVerification: [],
      cointJohansenVerification: [],
      sourceIndicatorIdsAndWeights: [],
      member: { id: 1 },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });

    await customForecastIndicatorEntity.insert({
      id: 'f5206520-da94-11ee-b91b-3551e6db3100',
      customForecastIndicatorName: '삭제용 예측지표',
      type: 'customForecastIndicator',
      targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
      grangerVerification: [],
      cointJohansenVerification: [],
      sourceIndicatorIdsAndWeights: [],
      member: { id: 1 },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });

    await customForecastIndicatorEntity.insert({
      id: 'f5206520-da94-11ee-b91b-3551e6db3101',
      customForecastIndicatorName: '수정용 예측지표',
      type: 'customForecastIndicator',
      targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
      grangerVerification: [],
      cointJohansenVerification: [],
      sourceIndicatorIdsAndWeights: [],
      member: { id: 1 },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
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
          TypeOrmModule.forFeature([MemberEntity, IndicatorBoardMetadataEntity, CustomForecastIndicatorEntity]),
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
              entities: [IndicatorBoardMetadataEntity, MemberEntity, CustomForecastIndicatorEntity],
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
        controllers: [CustomForecastIndicatorController],
        providers: [
          AuthService,
          InsertCustomForecastIndicatorIdCommandHandler,
          CreateCustomForecastIndicatorCommandHandler,
          GetCustomForecastIndicatorQueryHandler,
          GetCustomForecastIndicatorsByMemberIdQueryHandler,
          DeleteCustomForecastIndicatorCommandHandler,
          UpdateCustomForecastIndicatorNameCommandHandler,
          {
            provide: 'LoadIndicatorBoardMetadataPort',
            useClass: IndicatorBoardMetadataPersistentAdapter,
          },
          {
            provide: 'InsertCustomForecastIndicatorIdPort',
            useClass: IndicatorBoardMetadataPersistentAdapter,
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
            provide: 'DeleteCustomForecastIndicatorPort',
            useClass: CustomForecastIndicatorPersistentAdapter,
          },
          {
            provide: 'UpdateCustomForecastIndicatorNamePort',
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

  it('/post 예측 지표를 생성한다.', async () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/custom-forecast-indicator')
      .send({
        customForecastIndicatorName: '예측지표',
        targetIndicatorId: '2efa1d0c-51b3-42b1-81ba-487a07c4c5b2',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/get 예측 지표 id로 예측지표를 불러온다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/custom-forecast-indicator/f5206520-da94-11ee-b91b-3551e6db3bbd')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get 예측 지표 id로 예측지표를 불러올 때 예측지표 id가 db에없는 경우', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/custom-forecast-indicator/f5206520-da94-11ee-b91b-3551e6db3bbc')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/get 예측 지표 id로 예측지표를 불러올 때 예측지표 id가 잘못된 형식일 경우', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/custom-forecast-indicator/invaliduuid')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/get 사용자 id로 예측지표를 불러온다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/custom-forecast-indicator')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 예측지표를 삭제한다', async () => {
    return request(app.getHttpServer())
      .delete('/api/numerical-guidance/custom-forecast-indicators/f5206520-da94-11ee-b91b-3551e6db3100')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 예측지표를 삭제한다. - DB에 id가 존재하지 않는다.', async () => {
    return request(app.getHttpServer())
      .delete('/api/numerical-guidance/custom-forecast-indicators/f5206520-da94-11ee-b91b-3551e6db3999')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/delete 예측지표를 삭제한다. - 유효하지않은 id를 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete('/api/numerical-guidance/custom-forecast-indicators/invalid-id')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/patch 예측지표 이름을 수정한다.', async () => {
    return request(app.getHttpServer())
      .patch('/api/numerical-guidance/custom-forecast-indicator/name/f5206520-da94-11ee-b91b-3551e6db3101')
      .send({
        name: '수정후이름',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/patch 예측지표 이름을 수정한다. - DB에 예측지표가 존재하지 않을경우', async () => {
    return request(app.getHttpServer())
      .patch('/api/numerical-guidance/custom-forecast-indicator/name/f5206520-da94-11ee-b91b-3551e6db3105')
      .send({
        name: '수정후이름',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/patch 예측지표 이름을 수정한다. - 아이디 형식이 uuid가 아닌 경우', async () => {
    return request(app.getHttpServer())
      .patch('/api/numerical-guidance/custom-forecast-indicator/name/not-uuid')
      .send({
        name: '수정후이름',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/patch 예측지표 이름을 수정한다. - 이름이 공백일 경우', async () => {
    return request(app.getHttpServer())
      .patch('/api/numerical-guidance/custom-forecast-indicator/name/f5206520-da94-11ee-b91b-3551e6db3101')
      .send({
        name: '   ',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });
});
