import { Test } from '@nestjs/testing';
import { SearchTwelveIndicatorQueryHandler } from '../../../../application/query/indicator/search-twelve-indicator/search-twelve-indicator.query.handler';
import { SearchTwelveIndicatorPort } from '../../../../application/port/persistence/indicator/search-twelve-indicator.port';
import {
  SearchedSymbolType,
  SearchedIndicatorsDto,
} from '../../../../application/query/indicator/search-twelve-indicator/dto/searched-indicators.dto';
import { SearchTwelveIndicatorQuery } from '../../../../application/query/indicator/search-twelve-indicator/search-twelve-indicator.query';

describe('SearchTwelveIndicatorQueryHandler', () => {
  let searchTwelveIndicatorQueryHandler: SearchTwelveIndicatorQueryHandler;
  let searchTwelveIndicatorPort: SearchTwelveIndicatorPort;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SearchTwelveIndicatorQueryHandler,
        {
          provide: 'SearchTwelveIndicatorPort',
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
    searchTwelveIndicatorQueryHandler = module.get(SearchTwelveIndicatorQueryHandler);
    searchTwelveIndicatorPort = module.get('SearchTwelveIndicatorPort');
  });

  it('지표 리스트를 가져온다.', async () => {
    // given
    const query: SearchTwelveIndicatorQuery = { symbol: 'AA' };

    // when
    await searchTwelveIndicatorQueryHandler.execute(query);

    // then
    expect(searchTwelveIndicatorPort.searchIndicator).toHaveBeenCalledTimes(1);
  });
});
