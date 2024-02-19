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
import { BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';

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
    await memberRepository.insert({ id: 5 });
    memberRepository.save;

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      indicatorBoardMetaDataName: 'name',
      tickers: { 'k-stock': [], exchange: [] },
      member: { id: 10 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba72',
      indicatorBoardMetaDataName: 'name',
      tickers: { 'k-stock': [], exchange: [] },
      member: { id: 5 },
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
    const memberId = 10;
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

  it('지표보드 메타데이터 생성 - 회원을 찾지 못한 경우', async () => {
    const invalidMemberId = 11;
    const indicatorBoardMetaData: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew('메타 데이터');

    // when // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.createIndicatorBoardMetaData(
        indicatorBoardMetaData,
        invalidMemberId,
      );
    }).rejects.toThrow(
      new NotFoundException({
        message: '[ERROR] 해당 회원을 찾을 수 없습니다.',
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
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

  it('생성한 지표보드 메타데이터 id로 메타데이터 가져오기 - DB에 존재하지 않는 경우', async () => {
    // given
    const invalidId = 'a46240d3-7d15-48e7-a9b7-f490bf9ca6e3';

    // when
    // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(invalidId);
    }).rejects.toThrow(
      new NotFoundException({
        message: '[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.',
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('생성한 지표보드 메타데이터 id로 메타데이터 가져오기 - id 형식이 맞지 않는 경우', async () => {
    // given
    const invalidId = 'invalidUUID';

    // when
    // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(invalidId);
    }).rejects.toThrow(
      new BadRequestException({
        message: `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다. 다음을 확인해보세요.
          1. id 값이 uuid 형식을 잘 따르고 있는가
          `,
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

  it('사용자 id로 메타데이터 리스트 가져오기.', async () => {
    // given
    // when
    const result = await indicatorBoardMetaDataPersistentAdapter.loadUserIndicatorBoardMetadataList(5);
    // then
    const expectedFirstTickerId = '0d73cea1-35a5-432f-bcd1-27ae3541ba72';
    expect(result[0]['id']).toEqual(expectedFirstTickerId);
    expect(result.length).toEqual(1);
  });

  it('사용자 id로 메타데이터 리스트를 가져오기 - 해당 회원이 없을 경우', async () => {
    // given
    // when
    // then
    expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.loadUserIndicatorBoardMetadataList(154);
    }).rejects.toThrow(
      new NotFoundException({
        message: '[ERROR] 해당 회원을 찾을 수 없습니다.',
        error: Error,
      }),
    );
  });

  it('사용자 id로 메타데이터 리스트를 가져오기 - 유효하지 않은 member id값일 경우', async () => {
    // given
    // when
    // thesn
    expect(async () => {
      const id = 'invalid id';
      await indicatorBoardMetaDataPersistentAdapter.loadUserIndicatorBoardMetadataList(id);
    }).rejects.toThrow(
      new BadRequestException({
        message: '[ERROR] 메타데이터 리스트를 불러오는 중 오류가 발생했습니다. member id값이 number인지 확인하세요.',
        error: Error,
      }),
    );
  });
});
