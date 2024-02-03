import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicatorBoardMetaDataPersistentAdapter } from '../../../../infrastructure/adapter/persistent/indicator-board-meta-data.persistent.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorBoardMetaData } from '../../../../domain/indicator-board-meta-data';
import { IndicatorBoardMetaDataEntity } from '../../../../infrastructure/adapter/persistent/entity/indicator-board-meta-data.entity';
import { MemberEntity } from '../../../../../auth/member.entity';
import { DockerComposeEnvironment } from 'testcontainers';

const composeFilePath = '';
const composeFileName = 'docker-compose-api.yml';

describe('IndicatorBoardMetaDataPersistentAdapter', () => {
  let environment;
  let indicatorBoardMetaDataPersistentAdapter: IndicatorBoardMetaDataPersistentAdapter;

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'build') {
      environment = await new DockerComposeEnvironment(composeFilePath, composeFileName).up(['db']);
    }
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            retryAttempts: 20,
            retryDelay: 5000,
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('POSTGRES_USER'),
            password: configService.get<string>('POSTGRES_PASSWORD'),
            database: configService.get<string>('POSTGRES_USER'),
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
    if (environment) {
      await environment.down();
    }
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
