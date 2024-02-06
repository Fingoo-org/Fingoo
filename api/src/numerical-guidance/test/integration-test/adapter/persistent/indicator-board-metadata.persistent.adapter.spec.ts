import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicatorBoardMetadataPersistentAdapter } from '../../../../infrastructure/adapter/persistence/indicator-board-metadata.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { IndicatorBoardMetadataEntity } from '../../../../infrastructure/adapter/persistence/entity/indicator-board-metadata.entity';
import { MemberEntity } from '../../../../../auth/member.entity';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('IndicatorBoardMetaDataPersistentAdapter', () => {
  let environment;
  let indicatorBoardMetaDataPersistentAdapter: IndicatorBoardMetadataPersistentAdapter;

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
            entities: [IndicatorBoardMetadataEntity, MemberEntity],
            synchronize: true,
          }),
        }),
      ],
      providers: [IndicatorBoardMetadataPersistentAdapter],
    }).compile();
    indicatorBoardMetaDataPersistentAdapter = module.get(IndicatorBoardMetadataPersistentAdapter);
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('지표보드 메타데이터 생성 확인', async () => {
    // given
    const member: MemberEntity = new MemberEntity();
    await member.save();
    const indicatorBoardMetaData: IndicatorBoardMetadata = IndicatorBoardMetadata.createNew(
      '메타 데이터',
      { key1: ['1', '2', '3'] },
      member.id,
    );

    // when
    const resultId = await indicatorBoardMetaDataPersistentAdapter.createIndicatorBoardMetaData(indicatorBoardMetaData);
    const resultIndicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity =
      await IndicatorBoardMetadataEntity.findById(resultId);

    // then
    expect(resultIndicatorBoardMetaDataEntity.indicatorBoardMetaDataName).toEqual('메타 데이터');
  });
});
