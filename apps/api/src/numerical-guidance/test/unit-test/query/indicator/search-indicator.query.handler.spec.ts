import { Test } from '@nestjs/testing';
import { SearchIndicatorBySymbolPort } from 'src/numerical-guidance/application/port/persistence/indicator/search-indicator-by-symbol.port';
import { SearchIndicatorQuery } from 'src/numerical-guidance/application/query/indicator/search-indicator/search-indicator.query';
import { SearchIndicatorQueryHandler } from 'src/numerical-guidance/application/query/indicator/search-indicator/search-indicator.query.handler';
import { SearchIndicatorByTypeAndSymbolPort } from '../../../../application/port/persistence/indicator/search-indicator-by-type-and-symbol.port';
import { StockDto } from '../../../../application/query/indicator/get-indicator-list/dto/stock.dto';

describe('SearchIndicatorQueryHandler', () => {
  let searchIndicatorQueryHandler: SearchIndicatorQueryHandler;
  let searchIndicatorBySymbolPort: SearchIndicatorBySymbolPort;
  let searchIndicatorByTypeAndSymbolPort: SearchIndicatorByTypeAndSymbolPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchIndicatorQueryHandler,
        {
          provide: 'SearchIndicatorBySymbolPort',
          useValue: {
            searchIndicatorBySymbol: jest.fn().mockImplementation(() => {
              const indicator: StockDto = {
                id: '34bcb58c-1ea6-44a5-bb6a-dcd8929ab2b6',
                index: 1,
                indicatorType: 'stocks',
                symbol: '000020',
                name: 'Dongwha Pharm.Co.,Ltd',
                country: 'South Korea',
                currency: 'KRW',
                exchange: 'KRX',
                mic_code: 'XKRX',
                type: 'Common Stock',
              };
              return indicator;
            }),
          },
        },
        {
          provide: 'SearchIndicatorByTypeAndSymbolPort',
          useValue: {
            searchIndicatorByTypeAndSymbol: jest.fn().mockImplementation(() => {
              const indicator: StockDto[] = [
                {
                  id: '34bcb58c-1ea6-44a5-bb6a-dcd8929ab2b6',
                  index: 1,
                  indicatorType: 'stocks',
                  symbol: '000020',
                  name: 'Dongwha Pharm.Co.,Ltd',
                  country: 'South Korea',
                  currency: 'KRW',
                  exchange: 'KRX',
                  mic_code: 'XKRX',
                  type: 'Common Stock',
                },
              ];
              return indicator;
            }),
          },
        },
      ],
    }).compile();
    searchIndicatorQueryHandler = module.get(SearchIndicatorQueryHandler);
    searchIndicatorBySymbolPort = module.get('SearchIndicatorBySymbolPort');
    searchIndicatorByTypeAndSymbolPort = module.get('SearchIndicatorByTypeAndSymbolPort');
  });
  it('symbol로 지표를 검색한다.', async () => {
    // given
    const query: SearchIndicatorQuery = { symbol: '000020', type: 'none' };

    // when
    await searchIndicatorQueryHandler.execute(query);

    // then
    expect(searchIndicatorBySymbolPort.searchIndicatorBySymbol).toHaveBeenCalledTimes(1);
  });

  it('type, symbol로 지표를 검색한다.', async () => {
    // given
    const query: SearchIndicatorQuery = { symbol: '000020', type: 'stocks' };

    // when
    await searchIndicatorQueryHandler.execute(query);

    // then
    expect(searchIndicatorByTypeAndSymbolPort.searchIndicatorByTypeAndSymbol).toHaveBeenCalledTimes(1);
  });
});
