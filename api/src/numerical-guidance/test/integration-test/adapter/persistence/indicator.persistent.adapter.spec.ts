import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { IndicatorPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { IndicatorsDto } from '../../../../application/query/indicator/basic/dto/indicators.dto';
import { BondsEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { StockEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { GetIndicatorListQuery } from '../../../../application/query/indicator/get-indicator-list.query';
import { StockDto } from '../../../../application/query/indicator/dto/stock.dto';
import { CryptoCurrenciesDto } from '../../../../application/query/indicator/dto/crypto-currencies.dto';
import { ETFDto } from '../../../../application/query/indicator/dto/etf.dto';
import { ForexPairDto } from '../../../../application/query/indicator/dto/forex-pair.dto';
import { IndicesDto } from '../../../../application/query/indicator/dto/indices.dto';
import { FundDto } from '../../../../application/query/indicator/dto/fund.dto';
import { BondsDto } from '../../../../application/query/indicator/dto/bonds.dto';
import * as fs from 'fs';

const testData = {
  indicators: [
    {
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      name: '삼성전자',
      ticker: '005930',
      type: 'stocks',
      market: 'KOSPI',
    },
    {
      id: '1ebee29f-7208-4df6-b53d-521b2f81fdce',
      name: '이스트아시아',
      ticker: '900110',
      type: 'stocks',
      market: 'KOSDAQ',
    },
  ],
};

const filePath = './src/numerical-guidance/test/data/indicator-list-stocks.json';
const data = fs.readFileSync(filePath, 'utf8');
const testIndicatorList = JSON.parse(data);

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
        type: 'stocks',
        market: 'KOSPI',
      },
      {
        id: '1ebee29f-7208-4df6-b53d-521b2f81fdce',
        name: '이스트아시아',
        ticker: '900110',
        type: 'stocks',
        market: 'KOSDAQ',
      },
    ]);

    const stockEntityRepository = dataSource.getRepository(StockEntity);
    await stockEntityRepository.clear();
    await stockEntityRepository.insert(testIndicatorList);
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([
          IndicatorEntity,
          BondsEntity,
          CryptoCurrenciesEntity,
          ETFEntity,
          ForexPairEntity,
          FundEntity,
          IndicesEntity,
          StockEntity,
        ]),
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
            entities: [
              IndicatorEntity,
              BondsEntity,
              CryptoCurrenciesEntity,
              ETFEntity,
              ForexPairEntity,
              FundEntity,
              IndicesEntity,
              StockEntity,
            ],
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

  const cursors = [
    { index: 1, nextIndex: 11 },
    { index: 11, nextIndex: 21 },
  ];

  it.each(cursors)('지표 리스트 불러오기', async ({ index, nextIndex }) => {
    // given
    const { type, cursorToken }: GetIndicatorListQuery = {
      type: 'stocks',
      cursorToken: index,
    };

    // when
    const cursorPageDto: CursorPageDto<
      CryptoCurrenciesDto | ETFDto | ForexPairDto | IndicesDto | StockDto | FundDto | BondsDto
    > = await indicatorPersistentAdapter.loadIndicatorList(type, cursorToken);

    // then
    const expectedHasNextData = true;
    const expectedCursor = nextIndex;
    expect(expectedHasNextData).toEqual(cursorPageDto.meta.hasNextData);
    expect(expectedCursor).toEqual(cursorPageDto.meta.cursor);
  });

  it('지표 리스트 불러오기 - index 형식이 잘못된 경우', async () => {
    // given
    const invalidIndex = -10;
    const { type, cursorToken }: GetIndicatorListQuery = {
      type: 'stocks',
      cursorToken: invalidIndex,
    };

    // when // then
    await expect(async () => {
      await indicatorPersistentAdapter.loadIndicatorList(type, cursorToken);
    }).rejects.toThrow(
      new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] index: ${cursorToken} 해당 index의 indicator를 찾을 수 없습니다.`,
        message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
        cause: Error,
      }),
    );
  });
});
