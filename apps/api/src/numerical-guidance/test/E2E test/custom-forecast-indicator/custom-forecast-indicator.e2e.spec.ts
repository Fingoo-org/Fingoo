import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MemberEntity } from '../../../../auth/entity/member.entity';
import { IndicatorBoardMetadataEntity } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { CustomForecastIndicatorEntity } from '../../../infrastructure/adapter/persistence/custom-forecast-indicator/entity/custom-forecast-indicator.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CustomForecastIndicatorController } from '../../../api/custom-forecast-indicator/custom-forecast-indicator.controller';
import { AuthService } from '../../../../auth/application/auth.service';
import { InsertCustomForecastIndicatorIdCommandHandler } from '../../../application/command/custom-forecast-indicator/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command.handler';
import { CreateCustomForecastIndicatorCommandHandler } from '../../../application/command/custom-forecast-indicator/create-custom-forecast-indicator/create-custom-forecast-indicator.command.handler';
import { GetCustomForecastIndicatorQueryHandler } from '../../../application/query/custom-forecast-indicator/get-custom-forecast-indicator/get-custom-forecast-indicator.query.handler';
import { GetCustomForecastIndicatorsByMemberIdQueryHandler } from '../../../application/query/custom-forecast-indicator/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query.handler';
import { IndicatorBoardMetadataPersistentAdapter } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { CustomForecastIndicatorPersistentAdapter } from '../../../infrastructure/adapter/persistence/custom-forecast-indicator/custom-forecast-indicator.persistent.adapter';
import { HttpExceptionFilter } from '../../../../utils/exception-filter/http-exception-filter';
import * as request from 'supertest';
import { DeleteCustomForecastIndicatorCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/delete-custom-forecast-indicator/delete-custom-forecast-indicator.command.handler';
import { UpdateCustomForecastIndicatorNameCommandHandler } from 'src/numerical-guidance/application/command/custom-forecast-indicator/update-custom-forecast-indicator-name/update-custom-forecast-indicator-name.command.handler';
import { IndicatorPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { StockEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { TwelveApiUtil } from 'src/numerical-guidance/infrastructure/adapter/twelve/util/twelve-api.util';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { BondsEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { AdjustIndicatorValue } from 'src/numerical-guidance/util/adjust-indicator-value';
import { AuthModule } from '../../../../auth/auth.module';
import { SupabaseService } from '../../../../auth/supabase/supabase.service';
import { SupabaseStrategy } from '../../../../auth/supabase/supabase.strategy';
import { MockAuthGuard, mockAuthorization, mockUser } from '../../../../auth/test/data/mock-auth.guard';
import { of } from 'rxjs';

initializeTransactionalContext();

describe('Customer Forecast Indicator E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;

  const seeding = async () => {
    const memberEntity = dataSource.getRepository(MemberEntity);
    await memberEntity.insert({ id: '1', email: 'test@gmail.com' });

    const stockRepository = dataSource.getRepository(StockEntity);
    await stockRepository.insert({
      id: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
      index: 1,
      symbol: 'PPAL',
      indicatorType: 'stocks',
      name: 'Apple Inc',
      currency: 'USD',
      exchange: 'KOSPI',
      mic_code: 'XNGS',
      country: 'United States',
      type: 'Common Stock',
    });

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba99',
      indicatorBoardMetadataName: '예측지표추가 테스트용 메타데이터',
      indicatorInfos: [],
      customForecastIndicatorIds: [],
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
      member: { id: '1', email: 'test@gmail.com' },
    });

    const customForecastIndicatorEntity = dataSource.getRepository(CustomForecastIndicatorEntity);
    await customForecastIndicatorEntity.insert({
      id: 'f5206520-da94-11ee-b91b-3551e6db3bbd',
      customForecastIndicatorName: 'my second custom forecast indicators',
      type: 'customForecastIndicator',
      targetIndicator: {
        id: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
        name: '타켓지표',
        type: 'Common Stock',
        index: 1234,
        country: 'KOREA',
        currency: 'KRW',
        mic_code: 'PINX',
        indicatorType: 'stocks',
        exchange: 'KOSPI',
        symbol: 'PPAL',
      },
      grangerVerification: [],
      cointJohansenVerification: [],
      sourceIndicatorsInformation: [],
      sourceIndicators: [],
      member: { id: '1', email: 'test@gmail.com' },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });

    await customForecastIndicatorEntity.insert({
      id: 'f5206520-da94-11ee-b91b-3551e6db3100',
      customForecastIndicatorName: '삭제용 예측지표',
      type: 'customForecastIndicator',
      targetIndicator: {
        id: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf2',
        name: '타켓지표',
        type: 'Common Stock',
        index: 1234,
        country: 'KOREA',
        currency: 'KRW',
        mic_code: 'PINX',
        indicatorType: 'stocks',
        exchange: 'KOSPI',
        symbol: 'PPAL',
      },
      grangerVerification: [],
      cointJohansenVerification: [],
      sourceIndicatorsInformation: [],
      sourceIndicators: [],
      member: { id: '1', email: 'test@gmail.com' },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });

    await customForecastIndicatorEntity.insert({
      id: 'f5206520-da94-11ee-b91b-3551e6db3101',
      customForecastIndicatorName: '수정용 예측지표',
      type: 'customForecastIndicator',
      targetIndicator: {
        id: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf3',
        name: '타켓지표',
        type: 'Common Stock',
        index: 1234,
        country: 'KOREA',
        currency: 'KRW',
        mic_code: 'PINX',
        indicatorType: 'stocks',
        exchange: 'KOSPI',
        symbol: 'PPAL',
      },
      grangerVerification: [],
      cointJohansenVerification: [],
      sourceIndicatorsInformation: [],
      sourceIndicators: [],
      member: { id: '1', email: 'test@gmail.com' },
      createdAt: new Date('2024-02-23 10:00:02.292086'),
      updatedAt: new Date('2024-02-23 10:00:02.292086'),
    });
  };

  beforeAll(async () => {
    DBenvironment = await new PostgreSqlContainer().start();
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [
          AuthModule,
          CqrsModule,
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          TypeOrmModule.forFeature([
            MemberEntity,
            IndicatorBoardMetadataEntity,
            CustomForecastIndicatorEntity,
            StockEntity,
            IndicesEntity,
            FundEntity,
            ForexPairEntity,
            ETFEntity,
            CryptoCurrenciesEntity,
            BondsEntity,
            IndicatorEntity,
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
                MemberEntity,
                IndicatorBoardMetadataEntity,
                CustomForecastIndicatorEntity,
                StockEntity,
                IndicesEntity,
                FundEntity,
                ForexPairEntity,
                ETFEntity,
                CryptoCurrenciesEntity,
                BondsEntity,
                IndicatorEntity,
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
        controllers: [CustomForecastIndicatorController],
        providers: [
          TwelveApiUtil,
          AdjustIndicatorValue,
          AuthService,
          SupabaseService,
          SupabaseStrategy,
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
            provide: 'LoadIndicatorPort',
            useClass: IndicatorPersistentAdapter,
          },
          {
            provide: MockAuthGuard,
            useValue: {
              canActivate: jest.fn().mockImplementation((context) => {
                const request = context.switchToHttp().getRequest();
                request.user = mockUser;
                request.headers.authorization = mockAuthorization;
                return of(true);
              }),
            },
          },
        ],
      }).compile(),
    ]);
    dataSource = module.get<DataSource>(DataSource);
    addTransactionalDataSource(dataSource);
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
    app.useGlobalGuards(new MockAuthGuard());
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
        targetIndicatorId: '008628f5-4dbd-4c3b-b793-ca0fa22b3cf1',
        targetIndicatorType: 'stocks',
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
      .delete('/api/numerical-guidance/custom-forecast-indicator/f5206520-da94-11ee-b91b-3551e6db3100')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.OK);
  });

  it('/delete 예측지표를 삭제한다. - DB에 id가 존재하지 않는다.', async () => {
    return request(app.getHttpServer())
      .delete('/api/numerical-guidance/custom-forecast-indicator/f5206520-da94-11ee-b91b-3551e6db3999')
      .set('Content-Type', 'application/json')
      .expect(HttpStatus.NOT_FOUND);
  });

  it('/delete 예측지표를 삭제한다. - 유효하지않은 id를 요청한다.', async () => {
    return request(app.getHttpServer())
      .delete('/api/numerical-guidance/custom-forecast-indicator/invalid-id')
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
