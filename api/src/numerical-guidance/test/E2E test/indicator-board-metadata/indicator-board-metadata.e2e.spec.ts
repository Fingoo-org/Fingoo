import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IndicatorEntity } from '../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { MemberEntity } from '../../../../auth/member.entity';
import { IndicatorBoardMetadataEntity } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { IndicatorBoardMetadataController } from '../../../api/indicator-board-metadata/indicator-board-metadata.controller';
import { AdjustIndicatorValue } from '../../../util/adjust-indicator-value';
import { AuthService } from '../../../../auth/auth.service';
import { GetIndicatorBoardMetadataQueryHandler } from '../../../application/query/indicator-board-metadata/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { InsertIndicatorIdCommandHandler } from '../../../application/command/indicator/insert-indicator-id/insert-indicator-id.command.handler';
import { InsertCustomForecastIndicatorIdCommandHandler } from '../../../application/command/custom-forecast-indicator/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command.handler';
import { GetIndicatorBoardMetadataListQueryHandler } from '../../../application/query/indicator-board-metadata/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query.handler';
import { DeleteIndicatorIdCommandHandler } from '../../../application/command/indicator/delete-indicator-id/delete-indicator-id.command.handler';
import { DeleteIndicatorBoardMetadataCommandHandler } from '../../../application/command/indicator-board-metadata/delete-indicator-board-metadata/delete-indicator-board-metadata.command.handler';
import { UpdateIndicatorBoardMetadataNameCommandHandler } from '../../../application/command/indicator-board-metadata/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command.handler';
import { IndicatorBoardMetadataPersistentAdapter } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { AuthGuard } from '../../../../auth/auth.guard';
import { of } from 'rxjs';
import { HttpExceptionFilter } from '../../../../utils/exception-filter/http-exception-filter';
import * as request from 'supertest';
import { DeleteCustomForecastIndicatorIdCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/delete-custom-forecast-indicator-id/delete-custom-forecast-indicator-id.command.handler';
import { FileSupabaseAdapter } from '../../../infrastructure/adapter/storage/file.supabase.adapter';
import { UploadFileCommandHandler } from '../../../application/command/indicator-board-metadata/upload-file/upload-file.command.handler';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('Indicator Board Metadata E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;
  let fileSupabaseAdapter: FileSupabaseAdapter;

  const seeding = async () => {
    const memberEntity = dataSource.getRepository(MemberEntity);
    await memberEntity.insert({ id: 1 });

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: ['a79eface-1fd3-4b85-92ae-9628d37951fb'] },
      customForecastIndicatorIds: { customForecastIndicatorIds: ['customForecastIndicatorId1'] },
      member: { id: 1 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba77',
      indicatorBoardMetadataName: '삭제용 indicatorBoardMetadata',
      indicatorIds: { indicatorIds: ['indicatorId1'] },
      customForecastIndicatorIds: { customForecastIndicatorIds: ['customForecastIndicatorId1'] },
      member: { id: 1 },
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
          TypeOrmModule.forFeature([MemberEntity, IndicatorBoardMetadataEntity]),
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
        ],
        controllers: [IndicatorBoardMetadataController],
        providers: [
          AdjustIndicatorValue,
          AuthService,
          GetIndicatorBoardMetadataQueryHandler,
          InsertIndicatorIdCommandHandler,
          InsertCustomForecastIndicatorIdCommandHandler,
          GetIndicatorBoardMetadataListQueryHandler,
          DeleteIndicatorIdCommandHandler,
          DeleteIndicatorBoardMetadataCommandHandler,
          UpdateIndicatorBoardMetadataNameCommandHandler,
          DeleteCustomForecastIndicatorIdCommandHandler,
          UploadFileCommandHandler,
          FileSupabaseAdapter,
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
            provide: 'InsertCustomForecastIndicatorIdPort',
            useClass: IndicatorBoardMetadataPersistentAdapter,
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
            provide: 'DeleteCustomForecastIndicatorIdPort',
            useClass: IndicatorBoardMetadataPersistentAdapter,
          },
          {
            provide: 'UploadFilePort',
            useClass: FileSupabaseAdapter,
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
    fileSupabaseAdapter = module.get(FileSupabaseAdapter);
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

  it('/get 메타데이터 id를 전송해서 id에 해당하는 메타데이터를 가져온다.', async () => {
    return request(app.getHttpServer())
      .get(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/get db에 존재하지않는 메타데이터 id를 전송한다.', async () => {
    return request(app.getHttpServer())
      .get('/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba22')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/post 지표보드 메타데이터에 새로운 지표를 추가한다.', async () => {
    return request(app.getHttpServer())
      .post(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        indicatorId: 'a79eface-1fd3-4b85-92ae-9628d37951fa',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 지표보드 메타데이터에 새로운 지표를 추가할 때 중복 데이터를 넣는다', async () => {
    return request(app.getHttpServer())
      .post(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        indicatorId: 'a79eface-1fd3-4b85-92ae-9628d37951fb',
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
      .delete(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba77`)
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
      .patch(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        name: 'updateName',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/patch 지표보드 메타데이터의 이름을 수정할 때, 이름이 빈값으로 들어온다.', async () => {
    return request(app.getHttpServer())
      .patch(`/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60`)
      .send({
        name: '',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/post 지표보드 메타데이터에 새로운 예측지표를 추가한다.', async () => {
    return request(app.getHttpServer())
      .post(
        '/api/numerical-guidance/indicator-board-metadata/custom-forecast-indicator/0d73cea1-35a5-432f-bcd1-27ae3541ba60',
      )
      .send({
        customForecastIndicatorId: 'a1e019be-19f4-473b-9a02-d86d65eebab0',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.CREATED);
  });

  it('/post 지표보드 메타데이터에 새로운 예측지표를 추가한다. - db에 메타데이터 id가 존재하지 않을 경우', async () => {
    return request(app.getHttpServer())
      .post(
        '/api/numerical-guidance/indicator-board-metadata/custom-forecast-indicator/0d73cea1-35a5-432f-bcd1-27ae3541ba00',
      )
      .send({
        customForecastIndicatorId: 'a1e019be-19f4-473b-9a02-d86d65eebab0',
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/post 지표보드 메타데이터에 새로운 예측지표를 추가한다. - 중복 데이터를 집어놓을 경우', async () => {
    return request(app.getHttpServer())
      .post(
        '/api/numerical-guidance/indicator-board-metadata/custom-forecast-indicator/0d73cea1-35a5-432f-bcd1-27ae3541ba60',
      )
      .send({
        customForecastIndicatorId: "'customForecastIndicatorId1'",
      })
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/delete 지표보드 메타데이터에 예측지표 id를 삭제한다.', async () => {
    return request(app.getHttpServer())
      .delete(
        '/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/custom-forecast-indicator/a1e019be-19f4-473b-9a02-d86d65eebab0',
      )
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 지표보드 메타데이터에 예측지표 id를 삭제한다. - 메타데이터가 가지고있지 않은 예측지표id를 삭제한다.', async () => {
    return request(app.getHttpServer())
      .delete(
        '/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba60/custom-forecast-indicator/a1e019be-19f4-473b-9a02-d86d65eeba99',
      )
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('/delete 지표보드 메타데이터에 예측지표 id를 삭제한다. - DB에 존재하지 않는 메타데이터를 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete(
        '/api/numerical-guidance/indicator-board-metadata/0d73cea1-35a5-432f-bcd1-27ae3541ba77/custom-forecast-indicator/a1e019be-19f4-473b-9a02-d86d65eebab0',
      )
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/post 파일을 업로드한다.', async () => {
    const imagePath = './src/numerical-guidance/test/data/test-file.png';

    const response = request(app.getHttpServer())
      .post('/api/numerical-guidance/indicator-board-metadata/file/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach('fileName', imagePath);
    response.expect(HttpStatus.CREATED);

    await fileSupabaseAdapter.deleteFile('indicatorBoardMetadata/test-file.png');
  });

  it('/post 파일을 업로드한다. - 빈 파일을 보내는 경우', async () => {
    return request(app.getHttpServer())
      .post('/api/numerical-guidance/indicator-board-metadata/file/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach('fileName', null)
      .expect(HttpStatus.BAD_REQUEST);
  });
});
