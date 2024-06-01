import { Test } from '@nestjs/testing';
import { SearchIndicatorBySymbolPort } from 'src/numerical-guidance/application/port/persistence/indicator/search-indicator-by-symbol.port';
import { SearchIndicatorQuery } from 'src/numerical-guidance/application/query/indicator/search-indicator/search-indicator.query';
import { SearchIndicatorQueryHandler } from 'src/numerical-guidance/application/query/indicator/search-indicator/search-indicator.query.handler';
import { SearchIndicatorByTypeAndSymbolPort } from '../../../../application/port/persistence/indicator/search-indicator-by-type-and-symbol.port';
import { StockDto } from '../../../../application/query/indicator/get-indicator-list/dto/stock.dto';
import { EconomyDto } from '../../../../application/query/indicator/get-indicator-list/dto/economy.dto';
import { SearchEconomyIndicatorPort } from '../../../../application/port/persistence/indicator/search-economy-indicator.port';

describe('SearchIndicatorQueryHandler', () => {
  let searchIndicatorQueryHandler: SearchIndicatorQueryHandler;
  let searchIndicatorBySymbolPort: SearchIndicatorBySymbolPort;
  let searchIndicatorByTypeAndSymbolPort: SearchIndicatorByTypeAndSymbolPort;
  let searchEconomyIndicatorPort: SearchEconomyIndicatorPort;

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
        {
          provide: 'SearchEconomyIndicatorPort',
          useValue: {
            searchEconomicIndicator: jest.fn().mockImplementation(() => {
              const indicator: EconomyDto[] = [
                {
                  id: '62347e82-383b-4428-898b-4fac2414f341',
                  index: 14,
                  indicatorType: 'economy',
                  symbol: 'BOPBCAA',
                  name: 'Balance on Current Account (DISCONTINUED)',
                  frequency: 'Annual',
                  frequency_short: 'A',
                  units: 'Billions of Dollars',
                  units_short: 'Bil. of $',
                  seasonal_adjustment: 'Not Seasonally Adjusted',
                  seasonal_adjustment_short: 'NSA',
                  notes:
                    'This series has been discontinued as a result of the comprehensive restructuring of the international economic accounts (https://apps.bea.gov/scb/pdf/2014/07%20July/0714_annual_international_transactions_accounts.pdf). For a crosswalk of the old and new series in FRED see: http://research.stlouisfed.org/CompRevisionReleaseID49.xlsx.',
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
    searchEconomyIndicatorPort = module.get('SearchEconomyIndicatorPort');
  });

  it('type, symbol로 지표를 검색한다.', async () => {
    // given
    const query: SearchIndicatorQuery = { symbol: '000020', type: 'stocks' };

    // when
    await searchIndicatorQueryHandler.execute(query);

    // then
    expect(searchIndicatorByTypeAndSymbolPort.searchIndicatorByTypeAndSymbol).toHaveBeenCalledTimes(1);
  });

  it('symbol로 지표를 검색한다. - none', async () => {
    // given
    const query: SearchIndicatorQuery = { symbol: '000020', type: 'none' };

    // when
    await searchIndicatorQueryHandler.execute(query);

    // then
    expect(searchIndicatorBySymbolPort.searchIndicatorBySymbol).toHaveBeenCalledTimes(1);
  });

  it('type, symbol로 지표를 검색한다. - ecnonomy', async () => {
    // given
    const query: SearchIndicatorQuery = { symbol: 'BOPBCAA', type: 'economy' };

    // when
    await searchIndicatorQueryHandler.execute(query);

    // then
    expect(searchEconomyIndicatorPort.searchEconomicIndicator).toHaveBeenCalledTimes(1);
  });
});
