import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { of } from 'rxjs';
import * as request from 'supertest';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { AuthController } from '../../api/auth.controller';
import { SupabaseService } from '../../supabase/supabase.service';
import { SupabaseStrategy } from '../../supabase/supabase.strategy';
import { PassportModule } from '@nestjs/passport';
import { MemberEntity } from '../../entity/member.entity';
import { AuthService } from '../../application/auth.service';
import { MockAuthGuard, mockAuthorization, mockUser } from '../data/mock-auth.guard';
import { HttpExceptionFilter } from '../../../utils/exception-filter/http-exception-filter';
import { UserCertificationDto } from '../../api/dto/response/user-certification.dto';
import { CqrsModule } from '@nestjs/cqrs';

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signUp: jest.fn().mockImplementation(() => {
        return {
          user: { id: 'testUserId' },
          session: { access_token: 'testAccessToken' },
        };
      }),
      signInWithPassword: jest.fn().mockImplementation(() => {
        return {
          user: { id: 'testUserId' },
          session: { access_token: 'testAccessToken' },
        };
      }),
      getUser: jest.fn(),
    },
  })),
}));

initializeTransactionalContext();

describe('Auth E2E Test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let DBenvironment;

  const seeding = async () => {
    const memberRepository = dataSource.getRepository(MemberEntity);
    await memberRepository.insert({ id: '1', email: 'test@gmail.com' });
  };

  beforeAll(async () => {
    DBenvironment = await new PostgreSqlContainer().start();
    const [module] = await Promise.all([
      Test.createTestingModule({
        imports: [
          PassportModule,
          ConfigModule.forRoot({
            isGlobal: true,
          }),
          TypeOrmModule.forFeature([MemberEntity]),
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
              entities: [MemberEntity],
              synchronize: true,
            }),
          }),
          CqrsModule,
        ],
        controllers: [AuthController],
        providers: [
          AuthService,
          {
            provide: SupabaseService,
            useValue: {
              signIn: jest.fn().mockImplementation(() => {
                return UserCertificationDto.create({
                  userId: '6412800d-8afe-4524-aa23-35c3157b5bd8',
                  accessToken: 'ac',
                });
              }),
              signUp: jest.fn().mockImplementation(() => {
                return UserCertificationDto.create({
                  userId: '6412800d-8afe-4524-aa23-35c3157b5bd8',
                  accessToken: 'ac',
                });
              }),
            },
          },
          SupabaseStrategy,
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
    await seeding();
    addTransactionalDataSource(dataSource);
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

  it('/post 회원가입을 진행한다.', async () => {
    return request(app.getHttpServer())
      .post(`/api/auth/signUp`)
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@gmail.com',
        password: 'Test1!',
      })
      .expect(HttpStatus.CREATED);
  });

  it('/post 회원가입을 진행한다.', async () => {
    return request(app.getHttpServer())
      .post(`/api/auth/signIn`)
      .set('Content-Type', 'application/json')
      .send({
        email: 'test@test.com',
        password: 'Test1!',
      })
      .expect(HttpStatus.CREATED);
  });
});
