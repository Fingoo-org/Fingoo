import { StockDto } from '../../../../application/query/indicator/get-indicator-list/dto/stock.dto';
import { quoteIndicatorTestData1 } from '../../../data/quote-indicator-test-data';
import { GetQuoteIndicatorQueryHandler } from '../../../../application/query/quote-indicator/get-quote-indicator/get-quote-indicator.query.handler';
import { LoadIndicatorPort } from '../../../../application/port/persistence/indicator/load-indicator.port';
import { LoadCachedQuoteIndicatorPort } from '../../../../application/port/cache/load-cached-quote-indicator.port';
import { LoadQuoteIndicatorPort } from '../../../../application/port/external/twelve/load-quote-indicator.port';
import { CachingQuoteIndicatorPort } from '../../../../application/port/cache/caching-quote-indicator.port';
import { Test } from '@nestjs/testing';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { QuoteStockDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-stock.dto';
import { GetQuoteIndicatorQuery } from '../../../../application/query/quote-indicator/get-quote-indicator/get-quote-indicator.query';
import { IndicatorDtoType } from '../../../../../utils/type/type-definition';
import { IndicatorQuoteData } from '../../../../application/query/quote-indicator/get-quote-indicator/interface/quote-indicator-data.interface';

const testData: QuoteStockDto = quoteIndicatorTestData1;
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

describe('GetQuoteIndicatorQueryHandler', () => {
  let getQuoteIndicatorQueryHandler: GetQuoteIndicatorQueryHandler;
  let loadCachedQuoteIndicatorPort: LoadCachedQuoteIndicatorPort;
  let loadQuoteIndicatorPort: LoadQuoteIndicatorPort;
  let loadIndicatorPort: LoadIndicatorPort;
  let cachingQuoteIndicatorPort: CachingQuoteIndicatorPort;

  beforeEach(async () => {
    const testRedis = new Map<string, string>();
    const module = await Test.createTestingModule({
      imports: [CqrsModule, ConfigModule.forRoot()],
      providers: [
        GetQuoteIndicatorQueryHandler,
        {
          provide: 'LoadCachedQuoteIndicatorPort',
          useValue: {
            loadCachedQuoteIndicator: jest
              .fn()
              .mockImplementation((indicatorDto: IndicatorDtoType, interval: string) => {
                return testRedis.get(indicatorDto.id + interval);
              }),
          },
        },
        {
          provide: 'LoadQuoteIndicatorPort',
          useValue: {
            loadQuoteIndicator: jest.fn().mockImplementation(() => {
              return QuoteStockDto.create({ ...testData });
            }),
          },
        },
        {
          provide: 'LoadIndicatorPort',
          useValue: {
            loadIndicator: jest.fn().mockImplementation(() => {
              return testIndicator;
            }),
          },
        },
        {
          provide: 'CachingQuoteIndicatorPort',
          useValue: {
            cachingQuoteIndicator: jest
              .fn()
              .mockImplementation(
                (qouteIndicatorDto: IndicatorQuoteData, indicatorDto: IndicatorDtoType, interval: string) => {
                  testRedis.set(indicatorDto.id + interval, qouteIndicatorDto.toString());
                },
              ),
          },
        },
      ],
    }).compile();

    getQuoteIndicatorQueryHandler = module.get(GetQuoteIndicatorQueryHandler);
    loadCachedQuoteIndicatorPort = module.get('LoadCachedQuoteIndicatorPort');
    loadIndicatorPort = module.get('LoadIndicatorPort');
    loadQuoteIndicatorPort = module.get('LoadQuoteIndicatorPort');
    cachingQuoteIndicatorPort = module.get('CachingQuoteIndicatorPort');
  }, 10000);

  it('Quote 지표를 불러온다(Required Param)', async () => {
    //given
    const getQuoteIndicatorQuery: GetQuoteIndicatorQuery = new GetQuoteIndicatorQuery(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      'AAPL',
      'stocks',
    );

    //when
    await getQuoteIndicatorQueryHandler.execute(getQuoteIndicatorQuery);

    //then
    expect(loadQuoteIndicatorPort.loadQuoteIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(1);
    expect(cachingQuoteIndicatorPort.cachingQuoteIndicator).toHaveBeenCalledTimes(1);
  });

  it('Quote 지표가 redis에서 불러와진다.', async () => {
    //given
    const getQuoteIndicatorQuery: GetQuoteIndicatorQuery = new GetQuoteIndicatorQuery(
      '160e5499-4925-4e38-bb00-8ea6d8056484',
      'AAPL',
      'stocks',
    );

    //when
    await getQuoteIndicatorQueryHandler.execute(getQuoteIndicatorQuery);
    await getQuoteIndicatorQueryHandler.execute(getQuoteIndicatorQuery);

    //then
    expect(loadCachedQuoteIndicatorPort.loadCachedQuoteIndicator).toHaveBeenCalledTimes(2);
    expect(cachingQuoteIndicatorPort.cachingQuoteIndicator).toHaveBeenCalledTimes(1);
    expect(loadIndicatorPort.loadIndicator).toHaveBeenCalledTimes(2);
    expect(loadQuoteIndicatorPort.loadQuoteIndicator).toHaveBeenCalledTimes(1);
  });
});
