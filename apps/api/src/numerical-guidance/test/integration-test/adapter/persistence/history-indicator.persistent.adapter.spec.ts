// TODO: history 구현 후 refactoring

import { DataSource } from 'typeorm';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryIndicatorPersistentAdapter } from '../../../../infrastructure/adapter/persistence/history-indicator/history-indicator.persistent.adapter';
import { IndicatorEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { HistoryIndicatorEntity } from '../../../../infrastructure/adapter/persistence/history-indicator/entity/history-indicator.entity';
import * as fs from 'fs';
import { HistoryIndicatorValueEntity } from '../../../../infrastructure/adapter/persistence/history-indicator-value/entity/history-indicator-value.entity';
import { AdjustIndicatorValue } from '../../../../util/adjust-indicator-value';

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('HistoryIndicatorPersistentAdapter', () => {
  let environment;
  let dataSource: DataSource;
  // let historyIndicatorPersistentAdapter: HistoryIndicatorPersistentAdapter;
  const seeding = async () => {
    const indicatorEntity = dataSource.getRepository(IndicatorEntity);
    await indicatorEntity.insert({
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      name: '삼성전자',
      ticker: '005930',
      type: 'stocks',
      exchange: 'KOSPI',
    });
    indicatorEntity.save;

    const indicatorEntityByTicker = await dataSource.getRepository(IndicatorEntity).findOneBy({ ticker: '005930' });

    await dataSource.getRepository(HistoryIndicatorEntity).insert({
      id: indicatorEntityByTicker.id,
      name: indicatorEntityByTicker.name,
      type: indicatorEntityByTicker.type,
      ticker: indicatorEntityByTicker.ticker,
      exchange: indicatorEntityByTicker.exchange,
      values: [],
    });

    const historyIndicatorEntity: HistoryIndicatorEntity = await dataSource
      .getRepository(HistoryIndicatorEntity)
      .findOneBy({ id: indicatorEntityByTicker.id });

    const filePath = './src/numerical-guidance/test/data/history-indicator.json';

    const data = fs.readFileSync(filePath, 'utf8');

    const mockHistoryIndicatorValues = JSON.parse(data);
    const historyIndicatorValues = mockHistoryIndicatorValues.map((value) => {
      return {
        date: new Date(value.date),
        close: value.close,
        compare: value.compare,
        fluctuation: value.fluctuation,
        open: value.open,
        high: value.high,
        low: value.low,
        volume: value.volume,
        tradingValue: value.tradingValue,
        marketCapitalization: value.marketCapitalization,
        outstandingShares: value.outstandingShares,
      };
    });
    await dataSource.getRepository(HistoryIndicatorValueEntity).insert(historyIndicatorValues);
    const historyIndicatorValueEntities = await dataSource.getRepository(HistoryIndicatorValueEntity).find();
    historyIndicatorValueEntities.forEach((entity) => {
      entity.historyIndicator = historyIndicatorEntity;
    });
    await dataSource.getRepository(HistoryIndicatorValueEntity).save(historyIndicatorValueEntities);
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forFeature([IndicatorEntity, HistoryIndicatorEntity, HistoryIndicatorValueEntity]),
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
            entities: [IndicatorEntity, HistoryIndicatorEntity, HistoryIndicatorValueEntity],
            synchronize: true,
          }),
        }),
      ],
      providers: [
        HistoryIndicatorPersistentAdapter,
        {
          provide: 'IndicatorValueManager',
          useClass: AdjustIndicatorValue,
        },
      ],
    }).compile();
    // historyIndicatorPersistentAdapter = module.get(HistoryIndicatorPersistentAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('history 지표 불러오기', async () => {
    // // given
    // const { indicatorId, interval, dataCount, endDate }: GetHistoryIndicatorQuery = {
    //   indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
    //   interval: 'day',
    //   dataCount: 19,
    //   endDate: '20240227',
    // };
    //
    // // when
    // const cursorPageDto: CursorPageDto<HistoryIndicatorDto> =
    //   await historyIndicatorPersistentAdapter.loadHistoryIndicator(indicatorId, interval, dataCount, endDate);
    // const resultIndicator: HistoryIndicatorDto = <HistoryIndicatorDto>cursorPageDto.data;
    //
    // // then
    // const expectedTotalCount = 19;
    // const expectedValues = [
    //   {
    //     date: '20240226',
    //     value: '72800',
    //   },
    //   {
    //     date: '20240223',
    //     value: '72900',
    //   },
    //   {
    //     date: '20240222',
    //     value: '73100',
    //   },
    //   {
    //     date: '20240221',
    //     value: '73000',
    //   },
    //   {
    //     date: '20240220',
    //     value: '73300',
    //   },
    //   {
    //     date: '20240219',
    //     value: '73800',
    //   },
    //   {
    //     date: '20240216',
    //     value: '72800',
    //   },
    //   {
    //     date: '20240215',
    //     value: '73000',
    //   },
    //   {
    //     date: '20240214',
    //     value: '74000',
    //   },
    //   {
    //     date: '20240213',
    //     value: '75200',
    //   },
    //   {
    //     date: '20240208',
    //     value: '74100',
    //   },
    //   {
    //     date: '20240207',
    //     value: '75000',
    //   },
    //   {
    //     date: '20240206',
    //     value: '74400',
    //   },
    //   {
    //     date: '20240205',
    //     value: '74300',
    //   },
    //   {
    //     date: '20240202',
    //     value: '75200',
    //   },
    //   {
    //     date: '20240201',
    //     value: '73600',
    //   },
    //   {
    //     date: '20240131',
    //     value: '72700',
    //   },
    //   {
    //     date: '20240130',
    //     value: '74300',
    //   },
    //   {
    //     date: '20240129',
    //     value: '74400',
    //   },
    // ];
    // const expectedIndicator = {
    //   id: '160e5499-4925-4e38-bb00-8ea6d8056484',
    //   name: '삼성전자',
    //   ticker: '005930',
    //   type: 'stocks',
    //   market: 'KOSPI',
    // };
    // expect(expectedTotalCount).toEqual(cursorPageDto.meta.total);
    // expect(expectedIndicator).toEqual(resultIndicator.indicator);
    // expect(expectedValues).toEqual(resultIndicator.values);
    return true;
  });

  // it('history 지표 불러오기 - 날짜 형식이 잘못된 경우', async () => {
  //   // given
  //   const invalidStartDate = -10;
  //   const { indicatorId, interval, dataCount, endDate }: GetHistoryIndicatorQuery = {
  //     indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
  //     interval: 'day',
  //     dataCount: invalidStartDate,
  //     endDate: '20240227',
  //   };
  //
  //   // when // then
  //   await expect(async () => {
  //     await historyIndicatorPersistentAdapter.loadHistoryIndicator(indicatorId, interval, dataCount, endDate);
  //   }).rejects.toThrow(
  //     new NotFoundException({
  //       HttpStatus: HttpStatus.NOT_FOUND,
  //       error: `[ERROR] 지표를 cursor pagination 하는 중에 dataCount, endDate에 대한 entity를 찾지 못 했습니다. 올바른 날짜를 입력했는지 확인해주세요.`,
  //       message: '입력값이 올바른지 확인해주세요.',
  //       cause: Error,
  //     }),
  //   );
  // });
  //
  // const testDataCounts = [
  //   { dataCount: 1 },
  //   { dataCount: 2 },
  //   { dataCount: 3 },
  //   { dataCount: 4 },
  //   { dataCount: 5 },
  //   { dataCount: 6 },
  //   { dataCount: 7 },
  //   { dataCount: 8 },
  //   { dataCount: 9 },
  //   { dataCount: 10 },
  // ];
  //
  // it.each(testDataCounts)('history 지표 불러오기 - week 개수 test', async ({ dataCount }) => {
  //   // given
  //   const { indicatorId, interval, endDate }: GetHistoryIndicatorQuery = {
  //     indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
  //     interval: 'week',
  //     dataCount: dataCount,
  //     endDate: '20240227',
  //   };
  //
  //   // when
  //   const cursorPageDto: CursorPageDto<HistoryIndicatorDto> =
  //     await historyIndicatorPersistentAdapter.loadHistoryIndicator(indicatorId, interval, dataCount, endDate);
  //
  //   // then
  //   const expectedTotalCount = dataCount;
  //   expect(expectedTotalCount).toEqual(cursorPageDto.meta.total);
  // });
  //
  // it.each(testDataCounts.slice(0, 3))('history 지표 불러오기 - month 개수 test', async ({ dataCount }) => {
  //   // given
  //   const { indicatorId, interval, endDate }: GetHistoryIndicatorQuery = {
  //     indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
  //     interval: 'month',
  //     dataCount: dataCount,
  //     endDate: '20240227',
  //   };
  //
  //   // when
  //   const cursorPageDto: CursorPageDto<HistoryIndicatorDto> =
  //     await historyIndicatorPersistentAdapter.loadHistoryIndicator(indicatorId, interval, dataCount, endDate);
  //
  //   // then
  //   const expectedTotalCount = dataCount;
  //   expect(expectedTotalCount).toEqual(cursorPageDto.meta.total);
  // });
  //
  // it.each(testDataCounts.slice(0, 2))('history 지표 불러오기 - year 개수 test', async ({ dataCount }) => {
  //   // given
  //   const { indicatorId, interval, endDate }: GetHistoryIndicatorQuery = {
  //     indicatorId: '160e5499-4925-4e38-bb00-8ea6d8056484',
  //     interval: 'year',
  //     dataCount: dataCount,
  //     endDate: '20240227',
  //   };
  //
  //   // when
  //   const cursorPageDto: CursorPageDto<HistoryIndicatorDto> =
  //     await historyIndicatorPersistentAdapter.loadHistoryIndicator(indicatorId, interval, dataCount, endDate);
  //
  //   // then
  //   const expectedTotalCount = dataCount;
  //   expect(expectedTotalCount).toEqual(cursorPageDto.meta.total);
  // });
});
