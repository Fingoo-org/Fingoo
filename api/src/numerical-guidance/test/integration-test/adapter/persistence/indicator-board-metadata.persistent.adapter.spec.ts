import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicatorBoardMetadataPersistentAdapter } from '../../../../infrastructure/adapter/persistence/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { IndicatorBoardMetadataEntity } from '../../../../infrastructure/adapter/persistence/entity/indicator-board-metadata.entity';
import { MemberEntity } from '../../../../../auth/member.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AuthService } from '../../../../../auth/auth.service';
import { DataSource } from 'typeorm';
import { BadRequestException, HttpStatus } from '@nestjs/common';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('IndicatorBoardMetaDataPersistentAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorBoardMetaDataPersistentAdapter: IndicatorBoardMetadataPersistentAdapter;
  const seeding = async () => {
    const memberRepository = dataSource.getRepository(MemberEntity);
    await memberRepository.insert({ id: 10 });
    memberRepository.save;

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      indicatorBoardMetaDataName: 'name',
      tickers: { 'k-stock': [], exchange: [] },
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
      providers: [IndicatorBoardMetadataPersistentAdapter, AuthService],
    }).compile();
    indicatorBoardMetaDataPersistentAdapter = module.get(IndicatorBoardMetadataPersistentAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('지표보드 메타데이터 생성 확인', async () => {
    // given
    const memberId = 1;
    const indicatorBoardMetaData: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew('메타 데이터');

    // when
    const resultId = await indicatorBoardMetaDataPersistentAdapter.createIndicatorBoardMetaData(
      indicatorBoardMetaData,
      memberId,
    );
    const resultIndicatorBoardMetaData: IndicatorBoardMetadata =
      await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(resultId);

    // then
    expect(resultIndicatorBoardMetaData.indicatorBoardMetaDataName).toEqual('메타 데이터');
  });

  it('생성한 지표보드 메타데이터 id로 메타데이터 가져오기', async () => {
    // given
    const indicatorBoardMetaData: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew('메타 데이터');

    // when
    const resultId = await indicatorBoardMetaDataPersistentAdapter.createIndicatorBoardMetaData(
      indicatorBoardMetaData,
      10,
    );
    const result = await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(resultId);

    // then
    const expectedName = '메타 데이터';
    const expectedIndicatorTicker = { 'k-stock': '', exchange: '' };

    expect(result.indicatorBoardMetaDataName).toEqual(expectedName);
    expect(result.tickers).toEqual(expectedIndicatorTicker);
  });

  it('db에 존재하지 않는 메타보드 id를 입력해 예외처리 메세지 불러오기', async () => {
    // given

    // when
    // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData('invalidId');
    }).rejects.toThrow(
      new BadRequestException({
        message: '[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.',
        error: Error,
        HttpStatus: HttpStatus.BAD_REQUEST,
      }),
    );
  });

  it('지표보드 메타데이터에 새로운 지표 ticker 추가하기.', async () => {
    // given
    const newIndicatorBoardMetaData: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      'name',
      {
        'k-stock': ['ticker1', 'ticker2'],
        exchange: [],
      },
    );

    // when
    await indicatorBoardMetaDataPersistentAdapter.addIndicatorTicker(newIndicatorBoardMetaData);
    const result = await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
    );

    // then
    expect(result.indicatorBoardMetaDataName).toEqual('name');
    expect(result.tickers['k-stock']).toEqual('ticker1,ticker2');
  });
});
