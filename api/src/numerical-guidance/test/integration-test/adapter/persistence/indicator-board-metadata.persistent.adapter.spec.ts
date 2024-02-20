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
    memberRepository.save;

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      indicatorBoardMetaDataName: 'name',
      tickers: { 'k-stock': [], exchange: [] },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
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
        message: `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
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

  it('지표보드 메타데이터에 새로운 지표 ticker 추가하기. - DB에 존재하지 않는 경우', async () => {
    // given
    const newIndicatorBoardMetaData: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      'e46240d3-7d15-48e7-a9b7-f490bf9ca6e0',
      'name',
      {
        'k-stock': ['ticker1', 'ticker2'],
        exchange: [],
      },
    );
    // when // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.addIndicatorTicker(newIndicatorBoardMetaData);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('지표보드 메타데이터에서 지표 ticker 삭제하기.', async () => {
    // given
    const deleteIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      'name',
      {
        'k-stock': ['ticker1', 'ticker2'],
        exchange: [],
      },
    );
    // when
    await indicatorBoardMetaDataPersistentAdapter.deleteIndicatorTicker(deleteIndicatorBoardMetadata);
    const result = await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
    );

    // then
    expect(result.indicatorBoardMetaDataName).toEqual('name');
    expect(result.tickers['k-stock']).toEqual('ticker1,ticker2');
  });

  it('지표보드 메타데이터에서 지표 ticker 삭제하기. - DB에 존재하지 않는 경우', async () => {
    // given
    const deleteIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      'e46240d3-7d15-48e7-a9b7-f490bf9ca6e0',
      'name',
      {
        'k-stock': ['ticker1', 'ticker2'],
        exchange: [],
      },
    );

    // when // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.deleteIndicatorTicker(deleteIndicatorBoardMetadata);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('지표보드 메타데이터 삭제하기.', async () => {
    // given
    const deleteIndicatorBoardMetadataId: string = '0d73cea1-35a5-432f-bcd1-27ae3541ba73';

    // when
    await indicatorBoardMetaDataPersistentAdapter.deleteIndicatorBoardMetadata(deleteIndicatorBoardMetadataId);

    // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(deleteIndicatorBoardMetadataId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('지표보드 메타데이터 삭제하기. - DB에 존재하지 않는 경우', async () => {
    // given
    const invalidId: string = 'e46240d3-7d15-48e7-a9b7-f490bf9ca6e0';

    // when // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.deleteIndicatorBoardMetadata(invalidId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('지표보드 메타데이터 삭제하기. - id 형식이 올바르지 않은 경우', async () => {
    // given
    const invalidId: string = 'invalidId';

    // when // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.deleteIndicatorBoardMetadata(invalidId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 지표보드 메타데이터를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
        error: Error,
        HttpStatus: HttpStatus.BAD_REQUEST,
      }),
    );
  });

  it('지표보드 메타데이터 이름 수정하기.', async () => {
    // given
    const updateIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
      'updateName',
      {
        'k-stock': ['ticker1', 'ticker2'],
        exchange: [],
      },
    );
    // when
    await indicatorBoardMetaDataPersistentAdapter.updateIndicatorBoardMetadataName(updateIndicatorBoardMetadata);
    const result = await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
    );

    // then
    expect(result.indicatorBoardMetaDataName).toEqual('updateName');
  });

  it('지표보드 메타데이터 이름 수정하기. - DB에 존재하지 않는 경우', async () => {
    // given
    const invalidIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      'e46240d3-7d15-48e7-a9b7-f490bf9ca6e0',
      'updateName',
      {
        'k-stock': ['ticker1', 'ticker2'],
        exchange: [],
      },
    );

    // when // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.updateIndicatorBoardMetadataName(invalidIndicatorBoardMetadata);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('지표보드 메타데이터 이름 수정하기. - id 형식이 올바르지 않은 경우', async () => {
    // given
    const invalidIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      'invalidId',
      'updateName',
      {
        'k-stock': ['ticker1', 'ticker2'],
        exchange: [],
      },
    );

    // when // then
    await expect(async () => {
      await indicatorBoardMetaDataPersistentAdapter.updateIndicatorBoardMetadataName(invalidIndicatorBoardMetadata);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] 지표보드 메타데이터의 이름을 수정하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
        error: Error,
        HttpStatus: HttpStatus.BAD_REQUEST,
      }),
    );
  });
});
