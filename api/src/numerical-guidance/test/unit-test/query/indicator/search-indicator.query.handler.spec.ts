import { Test } from '@nestjs/testing';
import { SearchIndicatorQueryHandler } from '../../../../application/query/indicator/get-indicator-search/search-indicator.query.handler';
import { SearchIndicatorPort } from '../../../../application/port/persistence/indicator/search-indicator.port';
import {
  SearchedSymbolType,
  SearchedIndicatorsDto,
} from '../../../../application/query/indicator/get-indicator-search/dto/searched-indicators.dto';
import { SearchIndicatorQuery } from '../../../../application/query/indicator/get-indicator-search/search-indicator.query';

describe('SearchIndicatorQueryHandler', () => {
  let searchIndicatorQueryHandler: SearchIndicatorQueryHandler;
  let searchIndicatorPort: SearchIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchIndicatorQueryHandler,
        {
          provide: 'SearchIndicatorPort',
          useValue: {
            searchIndicator: jest.fn().mockImplementation(() => {
              const searchSymbols: SearchedSymbolType[] = [
                {
                  symbol: 'AA',
                  instrument_name: 'Alcoa Corp',
                  exchange: 'NYSE',
                  mic_code: 'XNYS',
                  exchange_timezone: 'America/New_York',
                  instrument_type: 'Common Stock',
                  country: 'United States',
                  currency: 'USD',
                },
                {
                  symbol: 'AAPL',
                  instrument_name: 'Apple Inc',
                  exchange: 'NASDAQ',
                  mic_code: 'XNGS',
                  exchange_timezone: 'America/New_York',
                  instrument_type: 'Common Stock',
                  country: 'United States',
                  currency: 'USD',
                },
              ];
              return SearchedIndicatorsDto.create(searchSymbols);
            }),
          },
        },
      ],
    }).compile();
    searchIndicatorQueryHandler = module.get(SearchIndicatorQueryHandler);
    searchIndicatorPort = module.get('SearchIndicatorPort');
  });

  it('지표 리스트를 가져온다.', async () => {
    // given
    const query: SearchIndicatorQuery = { symbol: 'AA' };

    // when
    await searchIndicatorQueryHandler.execute(query);

    // then
    expect(searchIndicatorPort.searchIndicator).toHaveBeenCalledTimes(1);
  });
});
