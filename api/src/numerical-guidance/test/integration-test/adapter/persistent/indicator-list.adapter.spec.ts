import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorListDto } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/indicator-list/entity/indicator.entity';
import { IndicatorListAdapter } from 'src/numerical-guidance/infrastructure/adapter/indicator-list/indicator-list.adapter';
import { DockerComposeEnvironment } from 'testcontainers';
import { DataSource } from 'typeorm';

const testData = {
  indicatorList: [
    {
      id: 1,
      name: '삼성전자',
      ticker: '005930',
      type: 'stock',
    },
    {
      id: 2,
      name: '이스트아시아',
      ticker: '900110',
      type: 'stock',
    },
  ],
};
const composeFilePath = '';
const composeFileName = 'docker-compose-api.yml';

describe('IndicatorListAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorListAdapter: IndicatorListAdapter;
  const seeding = async () => {
    const indicatorRepository = dataSource.getRepository(IndicatorEntity);
    await indicatorRepository.clear();
    await indicatorRepository.insert([
      {
        id: 1,
        name: '삼성전자',
        ticker: '005930',
        type: 'stock',
      },
      {
        id: 2,
        name: '이스트아시아',
        ticker: '900110',
        type: 'stock',
      },
    ]);
  };

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'build') {
      environment = await new DockerComposeEnvironment(composeFilePath, composeFileName).up(['db']);
    }
    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
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
            entities: ['src/**/**/*.entity.{ts,js}'],
            synchronize: true,
          }),
        }),
      ],
      providers: [IndicatorListAdapter],
    }).compile();
    indicatorListAdapter = module.get(IndicatorListAdapter);
    dataSource = module.get<DataSource>(DataSource);
    seeding();
  }, 10000);

  afterAll(async () => {
    if (environment) {
      await environment.down();
      dataSource.destroy();
    }
  });

  it('지표 리스트를 가져올 때 데이터가 올바른지 확인', async () => {
    // given

    // when
    const result: IndicatorListDto = await indicatorListAdapter.loadIndicatorList();
    const resultNum: number = result.indicatorList.length;

    // then
    const expected = testData;
    const expectedNum: number = 2;
    expect(result).toEqual(expected);
    expect(resultNum).toEqual(expectedNum);
  });
});
