import { Test } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthService } from '../../application/auth.service';
import { MemberEntity } from '../../entity/member.entity';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let environment;
  let dataSource: DataSource;
  const seeding = async () => {
    const memberRepository = dataSource.getRepository(MemberEntity);
    await memberRepository.insert({ id: '1', email: 'test@gmail.com' });
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();
    const module = await Test.createTestingModule({
      imports: [
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
            host: environment.getHost(),
            port: environment.getPort(),
            username: environment.getUsername(),
            password: environment.getPassword(),
            database: environment.getDatabase(),
            entities: [MemberEntity],
            synchronize: true,
          }),
        }),
      ],
      providers: [AuthService],
    }).compile();
    authService = module.get(AuthService);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('회원을 검색합니다.', async () => {
    // given
    const memberId = '1';

    // when
    const result = await authService.findById(memberId);

    // then
    const expectedId = '1';
    expect(result.id).toEqual(expectedId);
  });
});
