import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndicatorEntity } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/entity/indicator.entity';
import { IndicatorPersistentAdapter } from 'src/numerical-guidance/infrastructure/adapter/persistence/indicator/indicator.persistent.adapter';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DataSource } from 'typeorm';
import { BondsEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/bonds.entity';
import { CryptoCurrenciesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/crypto-currencies.entity';
import { ETFEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/etf.entity';
import { ForexPairEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/forex-pair.entity';
import { FundEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/fund.entity';
import { IndicesEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/indices.entity';
import { StockEntity } from '../../../../infrastructure/adapter/persistence/indicator/entity/stock.entity';
import { CursorPageDto } from '../../../../../utils/pagination/cursor-page.dto';
import { BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { GetIndicatorListQuery } from '../../../../application/query/indicator/get-indicator-list/get-indicator-list.query';
import * as fs from 'fs';
import { IndicatorDtoType } from '../../../../../utils/type/type-definition';
import { TwelveApiUtil } from '../../../../infrastructure/adapter/twelve/util/twelve-api.util';
import { HttpModule } from '@nestjs/axios';

const filePath = './src/numerical-guidance/test/data/indicator-list-stocks.json';
const data = fs.readFileSync(filePath, 'utf8');
const testIndicatorList = JSON.parse(data);

describe('IndicatorPersistentAdapter', () => {
  let environment;
  let dataSource: DataSource;
  let indicatorPersistentAdapter: IndicatorPersistentAdapter;
  const seeding = async () => {
    const stockEntityRepository = dataSource.getRepository(StockEntity);
    await stockEntityRepository.clear();
    await stockEntityRepository.insert(testIndicatorList);
    await stockEntityRepository.insert({
      id: '34bcb58c-1ea6-44a5-bb6a-dcd8929ab2b6',
      index: 1,
      indicatorType: 'stocks',
      symbol: 'validSymbol',
      name: 'search test indicator',
      country: 'South Korea',
      currency: 'KRW',
      exchange: 'KRX',
      mic_code: 'XKRX',
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
      providers: [IndicatorPersistentAdapter, TwelveApiUtil],
    }).compile();
    indicatorPersistentAdapter = module.get(IndicatorPersistentAdapter);
    dataSource = module.get<DataSource>(DataSource);
    await seeding();
  }, 20000);

  afterAll(async () => {
    await environment.stop();
    dataSource.destroy();
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
    const cursorPageDto: CursorPageDto<IndicatorDtoType> = await indicatorPersistentAdapter.loadIndicatorList(
      type,
      cursorToken,
    );

    // then
    const expectedHasNextData = true;
    const expectedCursor = nextIndex;
    expect(expectedHasNextData).toEqual(cursorPageDto.meta.hasNextData);
    expect(expectedCursor).toEqual(cursorPageDto.meta.cursor);
  });

  it('지표 리스트 불러오기 - index 형식이 잘못된 경우', async () => {
    // given
    const invalidIndex = -10.01;
    const { type, cursorToken }: GetIndicatorListQuery = {
      type: 'stocks',
      cursorToken: invalidIndex,
    };

    // when // then
    await expect(async () => {
      await indicatorPersistentAdapter.loadIndicatorList(type, cursorToken);
    }).rejects.toThrow(
      new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        error: `[ERROR] index, type 요청이 올바른지 확인해주세요.`,
        message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
        cause: Error,
      }),
    );
  });

  it('symbol로 지표 검색하기', async () => {
    // given
    const symbol = 'validSymbol';

    // when
    const indicator: any = await indicatorPersistentAdapter.searchIndicatorBySymbol(symbol);

    // then
    expect(indicator.id).toEqual('34bcb58c-1ea6-44a5-bb6a-dcd8929ab2b6');
    expect(indicator.symbol).toEqual(symbol);
    expect(indicator.country).toEqual('South Korea');
    expect(indicator.currency).toEqual('KRW');
    expect(indicator.exchange).toEqual('KRX');
    expect(indicator.mic_code).toEqual('XKRX');
    expect(indicator.type).toEqual('Common Stock');
    expect(indicator.name).toEqual('search test indicator');
  });

  it('symbol로 지표 검색하기', async () => {
    // given
    const symbol = 'InvalidSymbol';

    // when // then
    expect(async () => {
      await indicatorPersistentAdapter.searchIndicatorBySymbol(symbol);
    }).rejects.toThrow(
      new NotFoundException({
        HttpStatus: HttpStatus.NOT_FOUND,
        error: `[ERROR] symbol: ${symbol} 해당 symbol의 indicator를 찾을 수 없습니다.`,
        message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
        cause: Error,
      }),
    );
  });
});
