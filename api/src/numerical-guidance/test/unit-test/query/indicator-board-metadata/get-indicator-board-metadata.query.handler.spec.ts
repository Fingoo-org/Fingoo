import { Test } from '@nestjs/testing';
import { GetIndicatorBoardMetadataQuery } from 'src/numerical-guidance/application/query/indicator-board-metadata/get-indicator-board-metadata/get-indicator-board-metadata.query';
import { GetIndicatorBoardMetadataQueryHandler } from 'src/numerical-guidance/application/query/indicator-board-metadata/get-indicator-board-metadata/get-indicator-board-metadata.query.handler';
import { BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { MemberEntity } from '../../../../../auth/entity/member.entity';
import { IndicatorBoardMetadataEntity } from '../../../../infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../../../../../auth/application/auth.service';
import { DataSource } from 'typeorm';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('GetIndicatorBoardMetadataQueryHandler', () => {
  let getIndicatorBoardMetadataQueryHandler: GetIndicatorBoardMetadataQueryHandler;
  let environment;
  let dataSource: DataSource;

  const seeding = async () => {
    const memberRepository = dataSource.getRepository(MemberEntity);
    await memberRepository.insert({ id: '10' });
    await memberRepository.insert({ id: '5' });
    await memberRepository.insert({ id: '999' });
    memberRepository.save;

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      indicatorBoardMetadataName: '메타데이터',
      indicatorInfos: [],
      customForecastIndicatorIds: [],
      sections: { section1: [] },
      member: { id: '10' },
    });
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();
    const module = await Test.createTestingModule({
      imports: [
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
      providers: [GetIndicatorBoardMetadataQueryHandler, AuthService],
    }).compile();
    getIndicatorBoardMetadataQueryHandler = module.get(GetIndicatorBoardMetadataQueryHandler);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('지표보드 메타데이터 id를 가지고 메타데이터를 가져온다.', async () => {
    // given
    const testQuery = new GetIndicatorBoardMetadataQuery('0d73cea1-35a5-432f-bcd1-27ae3541ba73');

    // when
    const result = await getIndicatorBoardMetadataQueryHandler.execute(testQuery);

    // then
    const expectedName = '메타데이터';
    const expectedIndicatorIds = [];
    expect(result.indicatorBoardMetadataName).toEqual(expectedName);
    expect(result.indicatorInfos).toEqual(expectedIndicatorIds);
  });

  it('지표보드 메타데이터 id로 메타데이터 가져오기 - DB에 존재하지 않는 경우', async () => {
    // given
    const invalidQuery = new GetIndicatorBoardMetadataQuery('0d73cea1-35a5-432f-bcd1-27ae3541ba70');

    // when // then
    await expect(async () => {
      await getIndicatorBoardMetadataQueryHandler.execute(invalidQuery);
    }).rejects.toThrow(
      new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
        error: `[ERROR] indicatorBoardMetadataId: ${invalidQuery.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        cause: Error,
      }),
    );
  });

  it('지표보드 메타데이터 id로 메타데이터 가져오기 - id 형식이 맞지 않는 경우', async () => {
    // given
    const invalidQuery = new GetIndicatorBoardMetadataQuery('invalidId');

    // when // then
    await expect(async () => {
      await getIndicatorBoardMetadataQueryHandler.execute(invalidQuery);
    }).rejects.toThrow(
      new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
        error: `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
        cause: Error,
      }),
    );
  });
});
