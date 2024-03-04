import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicatorBoardMetadataPersistentAdapter } from '../../../../infrastructure/adapter/persistence/indicator-board-metadata/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { IndicatorBoardMetadataEntity } from '../../../../infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { MemberEntity } from '../../../../../auth/member.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AuthService } from '../../../../../auth/auth.service';
import { DataSource } from 'typeorm';
import { BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('IndicatorBoardMetadataPersistentAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorBoardMetadataPersistentAdapter: IndicatorBoardMetadataPersistentAdapter;
  const seeding = async () => {
    const memberRepository = dataSource.getRepository(MemberEntity);
    await memberRepository.insert({ id: 10 });
    await memberRepository.insert({ id: 5 });
    await memberRepository.insert({ id: 999 });
    memberRepository.save;

    const indicatorBoardMetadataRepository = dataSource.getRepository(IndicatorBoardMetadataEntity);
    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: [] },
      member: { id: 10 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba72',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: [] },
      member: { id: 5 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: 'f2be45ee-d73b-43b6-9344-a8f2264bee40',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: [] },
      member: { id: 5 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
      indicatorBoardMetadataName: 'name',
      indicatorIds: { indicatorIds: [] },
      member: { id: 5 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba10',
      indicatorBoardMetadataName: 'memberTest',
      indicatorIds: { indicatorIds: ['indicator1', 'indicator2'] },
      member: { id: 999 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba11',
      indicatorBoardMetadataName: 'memberTest',
      indicatorIds: { indicatorIds: ['indicator1', 'indicator2'] },
      member: { id: 999 },
    });

    await indicatorBoardMetadataRepository.insert({
      id: '0d73cea1-35a5-432f-bcd1-27ae3541ba12',
      indicatorBoardMetadataName: 'memberTest',
      indicatorIds: { indicatorIds: ['indicator1', 'indicator2'] },
      member: { id: 999 },
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
    indicatorBoardMetadataPersistentAdapter = module.get(IndicatorBoardMetadataPersistentAdapter);
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
    const resultId = await indicatorBoardMetadataPersistentAdapter.createIndicatorBoardMetadata(
      indicatorBoardMetaData,
      memberId,
    );
    const resultIndicatorBoardMetaData: IndicatorBoardMetadata =
      await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(resultId);

    // then
    expect(resultIndicatorBoardMetaData.indicatorBoardMetadataName).toEqual('메타 데이터');
  });

  it('지표보드 메타데이터 생성 - 회원을 찾지 못한 경우', async () => {
    const invalidMemberId = 11;
    const indicatorBoardMetaData: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew('메타 데이터');

    // when // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.createIndicatorBoardMetadata(
        indicatorBoardMetaData,
        invalidMemberId,
      );
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] memberId: ${invalidMemberId} 해당 회원을 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('생성한 지표보드 메타데이터 id로 메타데이터 가져오기', async () => {
    // given
    const indicatorBoardMetaData: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew('메타 데이터');

    // when
    const resultId = await indicatorBoardMetadataPersistentAdapter.createIndicatorBoardMetadata(
      indicatorBoardMetaData,
      10,
    );
    const result = await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(resultId);

    // then
    const expectedName = '메타 데이터';
    const expectedIndicatorId = [''];

    expect(result.indicatorBoardMetadataName).toEqual(expectedName);
    expect(result.indicatorIds).toEqual(expectedIndicatorId);
  });

  it('생성한 지표보드 메타데이터 id로 메타데이터 가져오기 - DB에 존재하지 않는 경우', async () => {
    // given
    const invalidId = 'a46240d3-7d15-48e7-a9b7-f490bf9ca6e3';

    // when
    // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(invalidId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] indicatorBoardMetadataId: ${invalidId} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
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
      await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(invalidId);
    }).rejects.toThrow(
      new BadRequestException({
        message: `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
        error: Error,
        HttpStatus: HttpStatus.BAD_REQUEST,
      }),
    );
  });

  it('지표보드 메타데이터에 새로운 지표 id 추가하기.', async () => {
    // given
    const newIndicatorBoardMetaData: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      'name',
      ['indicator1', 'indicator2'],
    );

    // when
    await indicatorBoardMetadataPersistentAdapter.addIndicatorId(newIndicatorBoardMetaData);
    const result = await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
    );

    // then
    expect(result.indicatorBoardMetadataName).toEqual('name');
    expect(result.indicatorIds).toEqual(['indicator1', 'indicator2']);
  });

  it('사용자 id로 메타데이터 리스트 가져오기.', async () => {
    // given
    const memberId = 999;

    // when
    const result = await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadataList(memberId);

    // then
    const expected = 3;
    expect(result.length).toEqual(expected);
  });

  it('사용자 id로 메타데이터 리스트를 가져오기 - 해당 회원이 없을 경우', async () => {
    // given
    const invalidId = 111;
    // when
    // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadataList(invalidId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] memberId: ${invalidId} 해당 회원을 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('사용자 id로 메타데이터 리스트를 가져오기 - 유효하지 않은 member id값일 경우', async () => {
    // given
    // when
    // then
    await expect(async () => {
      const id = 'invalid id';
      await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadataList(id);
    }).rejects.toThrow(
      new BadRequestException({
        message: '[ERROR] 메타데이터 리스트를 불러오는 중 오류가 발생했습니다. member id값이 number인지 확인하세요.',
        error: Error,
        HttpStatus: HttpStatus.BAD_REQUEST,
      }),
    );
  });

  it('지표보드 메타데이터에 새로운 지표 id 추가하기. - DB에 존재하지 않는 경우', async () => {
    // given
    const newIndicatorBoardMetaData: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      'f2be45ee-d73b-43b6-9344-a8f2264bee41',
      'name',
      ['indicator1', 'indicator2'],
    );

    // when // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.addIndicatorId(newIndicatorBoardMetaData);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] indicatorBoardMetadataId: ${newIndicatorBoardMetaData.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('지표보드 메타데이터에서 지표 삭제하기.', async () => {
    // given
    const deleteIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
      'name',
      ['indicator1', 'indicator2'],
    );

    // when
    await indicatorBoardMetadataPersistentAdapter.deleteIndicatorId(deleteIndicatorBoardMetadata);
    const result = await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba73',
    );

    // then
    expect(result.indicatorBoardMetadataName).toEqual('name');
    expect(result.indicatorIds).toEqual(['indicator1', 'indicator2']);
  });

  it('지표보드 메타데이터에서 지표 id 삭제하기. - DB에 존재하지 않는 경우', async () => {
    // given
    const deleteIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      'e46240d3-7d15-48e7-a9b7-f490bf9ca6e0',
      'name',
      ['indicator1', 'indicator2'],
    );

    // when // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.deleteIndicatorId(deleteIndicatorBoardMetadata);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] indicatorBoardMetadataId: ${deleteIndicatorBoardMetadata.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
        error: Error,
        HttpStatus: HttpStatus.NOT_FOUND,
      }),
    );
  });

  it('지표보드 메타데이터 삭제하기.', async () => {
    // given
    const deleteIndicatorBoardMetadataId: string = '0d73cea1-35a5-432f-bcd1-27ae3541ba72';

    // when
    await indicatorBoardMetadataPersistentAdapter.deleteIndicatorBoardMetadata(deleteIndicatorBoardMetadataId);

    // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(deleteIndicatorBoardMetadataId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] indicatorBoardMetadataId: ${deleteIndicatorBoardMetadataId} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
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
      await indicatorBoardMetadataPersistentAdapter.deleteIndicatorBoardMetadata(invalidId);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] indicatorBoardMetadataId: ${invalidId} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
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
      await indicatorBoardMetadataPersistentAdapter.deleteIndicatorBoardMetadata(invalidId);
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
      ['indicator1', 'indicator2'],
    );
    // when
    await indicatorBoardMetadataPersistentAdapter.updateIndicatorBoardMetadataName(updateIndicatorBoardMetadata);
    const result = await indicatorBoardMetadataPersistentAdapter.loadIndicatorBoardMetadata(
      '0d73cea1-35a5-432f-bcd1-27ae3541ba60',
    );

    // then
    expect(result.indicatorBoardMetadataName).toEqual('updateName');
  });

  it('지표보드 메타데이터 이름 수정하기. - DB에 존재하지 않는 경우', async () => {
    // given
    const invalidIndicatorBoardMetadata: IndicatorBoardMetadata = new IndicatorBoardMetadata(
      'e46240d3-7d15-48e7-a9b7-f490bf9ca6e0',
      'updateName',
      ['indicator1', 'indicator2'],
    );

    // when // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.updateIndicatorBoardMetadataName(invalidIndicatorBoardMetadata);
    }).rejects.toThrow(
      new NotFoundException({
        message: `[ERROR] indicatorBoardMetadataId: ${invalidIndicatorBoardMetadata.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
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
      ['indicator1', 'indicator2'],
    );

    // when // then
    await expect(async () => {
      await indicatorBoardMetadataPersistentAdapter.updateIndicatorBoardMetadataName(invalidIndicatorBoardMetadata);
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
