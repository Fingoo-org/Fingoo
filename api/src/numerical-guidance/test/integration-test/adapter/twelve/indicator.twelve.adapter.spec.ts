import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IndicatorTwelveAdapter } from '../../../../infrastructure/adapter/twelve/indicator.twelve.adapter';
import { SearchedIndicatorsDto } from '../../../../application/query/indicator/search-twelve-indicator/dto/searched-indicators.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { BondsEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { StockEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { TwelveApiUtil } from '../../../../infrastructure/adapter/twelve/util/twelve-api.util';
import { HttpModule } from '@nestjs/axios';
import { AdjustIndicatorValue } from '../../../../util/adjust-indicator-value';
import { LiveStockDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import { DataSource } from 'typeorm';
import { liveIndicatorTestData } from '../../../data/liveIndicator.test.data';
import { StockDto } from '../../../../application/query/indicator/get-indicator-list/dto/stock.dto';
import { LiveIndicatorDtoType } from '../../../../../utils/type/type-definition';

const testData = liveIndicatorTestData;

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('IndicatorTwelveAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorTwelveAdapter: IndicatorTwelveAdapter;
  const seeding = async () => {
    const stockRepository = dataSource.getRepository(StockEntity);
    stockRepository.insert({
      id: '5776afe3-6a3f-42e9-83ec-cb634b76f958',
      index: 1,
      symbol: 'AAPL',
      indicatorType: 'stocks',
      name: 'Apple Inc',
      currency: 'USD',
      exchange: 'NASDAQ',
      mic_code: 'XNGS',
      country: 'United States',
      type: 'Common Stock',
    });
  };

  beforeAll(async () => {
    environment = await new PostgreSqlContainer().start();

    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        HttpModule.registerAsync({
          useFactory: () => ({
            timeout: 10000,
            maxRedirects: 5,
          }),
        }),
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
      providers: [
        IndicatorTwelveAdapter,
        TwelveApiUtil,
        {
          provide: 'IndicatorValueManager',
          useClass: AdjustIndicatorValue,
        },
      ],
    }).compile();
    indicatorTwelveAdapter = module.get(IndicatorTwelveAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('symbol로 indicator 검색', async () => {
    // given
    const symbol: string = 'AA';

    // when
    const result: SearchedIndicatorsDto = await indicatorTwelveAdapter.searchIndicator(symbol);

    // then
    expect(result).not.toEqual(null);
  });

  it('live 지표를 가져온다.', async () => {
    // given
    const indicatorDto: StockDto = {
      id: '5776afe3-6a3f-42e9-83ec-cb634b76f958',
      index: 1,
      symbol: 'AAPL',
      indicatorType: 'stocks',
      name: 'Apple Inc',
      currency: 'USD',
      exchange: 'NASDAQ',
      mic_code: 'XNGS',
      country: 'United States',
      type: 'Common Stock',
    };

    // when
    const result: LiveIndicatorDtoType = await indicatorTwelveAdapter.loadLiveIndicator(
      indicatorDto,
      'day',
      '2024-02-12',
      '2024-03-16',
    );

    // then
    const expected: LiveStockDto = LiveStockDto.create({ ...testData });
    expect(result).toEqual(expected);
  }, 15000);
});
