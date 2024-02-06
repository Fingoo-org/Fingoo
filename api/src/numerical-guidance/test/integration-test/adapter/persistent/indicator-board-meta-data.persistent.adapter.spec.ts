import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicatorBoardMetaDataPersistentAdapter } from '../../../../infrastructure/adapter/persistent/indicator-board-meta-data.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetaData } from '../../../../domain/indicator-board-meta-data';
import { IndicatorBoardMetaDataEntity } from '../../../../infrastructure/adapter/persistent/entity/indicator-board-meta-data.entity';
import { MemberEntity } from '../../../../../auth/member.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('IndicatorBoardMetaDataPersistentAdapter', () => {
  let environment;
  let indicatorBoardMetaDataPersistentAdapter: IndicatorBoardMetaDataPersistentAdapter;

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
      member.id,
    );

    // when
    const resultId = await indicatorBoardMetaDataPersistentAdapter.createIndicatorBoardMetaData(indicatorBoardMetaData);
    const resultIndicatorBoardMetaDataEntity: IndicatorBoardMetaDataEntity =
      await IndicatorBoardMetaDataEntity.findById(resultId);

    // then
    expect(resultIndicatorBoardMetaDataEntity.indicatorBoardMetaDataName).toEqual('메타 데이터');
  });
});
