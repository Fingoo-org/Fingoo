import { Test } from '@nestjs/testing';
import { SearchIndicatorBySymbolPort } from 'src/numerical-guidance/application/port/persistence/indicator/search-indicator-by-symbol.port';
import { SearchIndicatorBySymbolQuery } from 'src/numerical-guidance/application/query/indicator/get-search-indicator-by-symbol/search-indicator-by-symbol.query';
import { SearchIndicatorBySymbolQueryHandler } from 'src/numerical-guidance/application/query/indicator/get-search-indicator-by-symbol/search-indicator-by-symbol.query.handler';

describe('SearchIndicatorBySymbolQueryHandler', () => {
  let searchIndicatorBySymbolQueryHandler: SearchIndicatorBySymbolQueryHandler;
  let searchIndicatorBySymbolPort: SearchIndicatorBySymbolPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchIndicatorBySymbolQueryHandler,
        {
          provide: 'SearchIndicatorBySymbolPort',
          useValue: {
            searchIndicatorBySymbol: jest.fn().mockImplementation(() => {
              const indicator = {
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
      ],
    }).compile();
    searchIndicatorBySymbolQueryHandler = module.get(SearchIndicatorBySymbolQueryHandler);
    searchIndicatorBySymbolPort = module.get('SearchIndicatorBySymbolPort');
  });
  it('symbol로 지표를 검색한다.', async () => {
    // given
    const query: SearchIndicatorBySymbolQuery = { symbol: '000020' };

    // when
    await searchIndicatorBySymbolQueryHandler.execute(query);

    // then
    expect(searchIndicatorBySymbolPort.searchIndicatorBySymbol).toHaveBeenCalledTimes(1);
  });
});
