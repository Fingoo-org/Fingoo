import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { Test } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { BondsEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { StockEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { HttpModule } from '@nestjs/axios';
import { DataSource } from 'typeorm';
import { LiveIndicatorDtoType } from '../../../../../utils/type/type-definition';
import { EconomyEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/economy.entity';
import { IndicatorFredAdapter } from '../../../../infrastructure/adapter/fred/indicator.fred.adapter';
import { FredApiManager } from '../../../../infrastructure/adapter/fred/util/fred-api.manager';
import { EconomyDto } from '../../../../application/query/indicator/get-indicator-list/dto/economy.dto';
import { LiveEconomyDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-ecnomy.dto';
import { liveEconomyIndicatorTestData } from '../../../data/live-economy-indicator-test-data';

const testData = liveEconomyIndicatorTestData;

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
}));

describe('IndicatorFredAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorFredAdapter: IndicatorFredAdapter;
  const seeding = async () => {
    const entityRepository = dataSource.getRepository(EconomyEntity);
    await entityRepository.insert({
      id: '9493336a-2a81-473d-98e4-a7a682cf176f',
      index: 16,
      indicatorType: 'economy',
      symbol: 'GNPCA',
      name: 'Real Gross National Product',
      frequency: 'Annual',
      frequency_short: 'A',
      units: 'Billions of Chained 2017 Dollars',
      units_short: 'Bil. of Chn. 2017 $',
      seasonal_adjustment: 'Not Seasonally Adjusted',
      seasonal_adjustment_short: 'NSA',
      notes: 'BEA Account Code: A001RX\n\n',
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
          EconomyEntity,
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
              EconomyEntity,
            ],
            synchronize: true,
          }),
        }),
      ],
      providers: [IndicatorFredAdapter, FredApiManager],
    }).compile();
    indicatorFredAdapter = module.get(IndicatorFredAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
  });

  it('live 지표를 가져온다.', async () => {
    // given
    const indicatorDto: EconomyDto = {
      id: '9493336a-2a81-473d-98e4-a7a682cf176f',
      index: 16,
      indicatorType: 'economy',
      symbol: 'GNPCA',
      name: 'Real Gross National Product',
      frequency: 'Annual',
      frequency_short: 'A',
      units: 'Billions of Chained 2017 Dollars',
      units_short: 'Bil. of Chn. 2017 $',
      seasonal_adjustment: 'Not Seasonally Adjusted',
      seasonal_adjustment_short: 'NSA',
      notes: 'BEA Account Code: A001RX\n\n',
    };

    // when
    const result: LiveIndicatorDtoType = await indicatorFredAdapter.loadLiveIndicator(
      indicatorDto,
      'none',
      '2001-01-01',
      '2024-05-30',
    );

    // then
    const expected: LiveEconomyDto = LiveEconomyDto.create({ ...testData });
    expect(result).toEqual(expected);
  }, 15000);
});
