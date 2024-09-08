import { quoteIndicatorTestData1 } from '../../../data/quote-indicator-test-data';
import { RedisContainer } from '@testcontainers/redis';
import { Test } from '@nestjs/testing';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import { QuoteIndicatorRedisAdapter } from '../../../../infrastructure/adapter/redis/quote-indicator.redis.adapter';
import { QuoteStockDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-stock.dto';
import { QuoteIndicatorIntervalEnum } from '../../../../../utils/enum/enum-definition';
import { StockDto } from '../../../../application/query/indicator/get-indicator-list/dto/stock.dto';

const testData1: QuoteStockDto = quoteIndicatorTestData1;
const testIndicator: StockDto = {
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
const testInterval: QuoteIndicatorIntervalEnum = QuoteIndicatorIntervalEnum.MIN1;
const testTimezone: string = 'Asia/Seoul';
const testDatetimeAfter10sec: Date = new Date(Date.UTC(2024, 7, 7, 15, 30, 10));

describe('quoteIndicatorRedisAdapter', () => {
  let environment;
  let quoteIndicatorRedisAdapter: QuoteIndicatorRedisAdapter;

  beforeAll(async () => {
    environment = await new RedisContainer().start();
    const module = await Test.createTestingModule({
      imports: [
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: () => ({
            type: 'single',
            url: environment.getConnectionUrl(),
          }),
        }),
      ],
      providers: [
        QuoteIndicatorRedisAdapter,
        {
          provide: 'CachingQuoteIndicatorPort',
          useClass: QuoteIndicatorRedisAdapter,
        },
      ],
    }).compile();

    quoteIndicatorRedisAdapter = module.get(QuoteIndicatorRedisAdapter);
  }, 10000);

  afterAll(async () => {
    await quoteIndicatorRedisAdapter.disconnectRedis();
    await environment.stop();
  });

  it('redis에서 캐시된 값을 불러오는 경우.', async () => {
    //given
    const expected = QuoteStockDto.create({ ...testData1 });
    await quoteIndicatorRedisAdapter.cachingQuoteIndicator(expected, testIndicator, testInterval, testTimezone);

    //when
    const result = await quoteIndicatorRedisAdapter.loadCachedQuoteIndicator(
      testIndicator,
      testInterval,
      testDatetimeAfter10sec,
      testTimezone,
    );

    //then
    expect(result).toEqual(expected);
  });

  it('redis에 캐시된 값이 없을 경우.', async () => {
    //given
    const otherIndicator: StockDto = {
      id: '160e5499-4925-4e38-bb00-8ea6d8056484',
      index: 1,
      symbol: 'AAPL',
      indicatorType: 'funds',
      name: 'Apple Inc',
      currency: 'USD',
      exchange: 'NASDAQ',
      mic_code: 'XNGS',
      country: 'United States',
      type: 'Common Stock',
    };
    const testCachingData = QuoteStockDto.create({ ...testData1 });
    await quoteIndicatorRedisAdapter.cachingQuoteIndicator(testCachingData, testIndicator, testInterval, testTimezone);

    //when
    const result = await quoteIndicatorRedisAdapter.loadCachedQuoteIndicator(
      otherIndicator,
      testInterval,
      testDatetimeAfter10sec,
      testTimezone,
    );

    //then
    const expected = null;
    expect(result).toEqual(expected);
  });
});
