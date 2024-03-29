import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { IndicatorPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { IndicatorsDto } from '../../../../application/query/indicator/dto/indicators.dto';

const testData = {
  indicators: [
    {
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      name: '삼성전자',
      ticker: '005930',
      type: 'k-stock',
      market: 'KOSPI',
    },
    {
      id: '1ebee29f-7208-4df6-b53d-521b2f81fdce',
      name: '이스트아시아',
      ticker: '900110',
      type: 'k-stock',
      market: 'KOSDAQ',
    },
  ],
};

describe('IndicatorPersistentAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorPersistentAdapter: IndicatorPersistentAdapter;
  const seeding = async () => {
    const indicatorRepository = dataSource.getRepository(IndicatorEntity);
    await indicatorRepository.clear();
    await indicatorRepository.insert([
      {
        id: '160e5499-4925-4e38-bb00-8ea6d8056484',
        name: '삼성전자',
        ticker: '005930',
        type: 'k-stock',
        market: 'KOSPI',
      },
      {
        id: '1ebee29f-7208-4df6-b53d-521b2f81fdce',
        name: '이스트아시아',
        ticker: '900110',
        type: 'k-stock',
        market: 'KOSDAQ',
      },
    ]);
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([IndicatorEntity]),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
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
            entities: [IndicatorEntity],
            synchronize: true,
          }),
        }),
      ],
      providers: [IndicatorPersistentAdapter],
    }).compile();
    indicatorPersistentAdapter = module.get(IndicatorPersistentAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
    dataSource.destroy();
  });

  it('지표 리스트를 가져올 때 데이터가 올바른지 확인', async () => {
    // given

    // when
    const result: IndicatorsDto = await indicatorPersistentAdapter.loadIndicators();
    const resultNum: number = result.indicators.length;

    // then
    const expected = testData;
    const expectedNum: number = 2;
    expect(result).toEqual(expected);
    expect(resultNum).toEqual(expectedNum);
  });
});
