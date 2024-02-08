import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicatorBoardMetaDataPersistentAdapter } from '../../../../infrastructure/adapter/persistent/indicator-board-meta-data.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetaData } from '../../../../domain/indicator-board-meta-data';
import { IndicatorBoardMetaDataEntity } from '../../../../infrastructure/adapter/persistent/entity/indicator-board-meta-data.entity';
import { MemberEntity } from '../../../../../auth/member.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';

describe('IndicatorBoardMetaDataPersistentAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorBoardMetaDataPersistentAdapter: IndicatorBoardMetaDataPersistentAdapter;
  const seeding = async () => {
    const memberRepository = dataSource.getRepository(MemberEntity);
    await memberRepository.insert({ id: 10 });
    memberRepository.save;
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
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
            entities: [IndicatorBoardMetaDataEntity, MemberEntity],
            synchronize: true,
          }),
        }),
      ],
      providers: [IndicatorBoardMetaDataPersistentAdapter],
    }).compile();
    indicatorBoardMetaDataPersistentAdapter = module.get(IndicatorBoardMetaDataPersistentAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('지표보드 메타데이터 생성 확인', async () => {
    // given
    const member: MemberEntity = new MemberEntity();
    await member.save();
    const indicatorBoardMetaData: IndicatorBoardMetaData = IndicatorBoardMetaData.createNew(
      '메타 데이터',
      { key1: ['1', '2', '3'] },
      10,
    );

    // when
    const resultId = await indicatorBoardMetaDataPersistentAdapter.createIndicatorBoardMetaData(indicatorBoardMetaData);
    const resultIndicatorBoardMetaDataEntity: IndicatorBoardMetaDataEntity =
      await IndicatorBoardMetaDataEntity.findById(resultId);

    // then
    expect(resultIndicatorBoardMetaDataEntity.indicatorBoardMetaDataName).toEqual('메타 데이터');
  });

  it('생성한 지표보드 메타데이터 id로 메타데이터 가져오기', async () => {
    // given
    const indicatorBoardMetaData: IndicatorBoardMetaData = IndicatorBoardMetaData.createNew(
      '메타 데이터',
      { key1: ['1', '2', '3'] },
      10,
    );

    // when
    const resultId = await indicatorBoardMetaDataPersistentAdapter.createIndicatorBoardMetaData(indicatorBoardMetaData);
    const result = await indicatorBoardMetaDataPersistentAdapter.loadIndicatorBoardMetaData(resultId);

    // then
    const expectedName = '메타 데이터';
    const expectedIndicatorId = { key1: '1,2,3' };
    const expectedMemberId = 10;

    expect(result.indicatorBoardMetaDataName).toEqual(expectedName);
    expect(result.indicatorIds).toEqual(expectedIndicatorId);
    expect(result.memberId).toEqual(expectedMemberId);
  });
});
