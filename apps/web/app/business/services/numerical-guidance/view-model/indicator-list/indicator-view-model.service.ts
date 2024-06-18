import { StockIndicator } from './indicators/stock-indicator.service';
import { ForexPairIndicator } from './indicators/forex-pair-indicator.service';
import { CryptocurrencyIndicator } from './indicators/cryptocurrency-indicator.service';
import { IndexIndicator } from './indicators/index-indicator.service';
import { FundIndicator } from './indicators/fund-indicator.service';
import { BondIndicator } from './indicators/bond-indicator.service';
import { EtfIndicator } from './indicators/etf-indicator.service';
import {
  IndicatorByTypeResponse,
  StocksIndicatorResponse,
  ForexPairsIndicatorResponse,
  CryptocurrenciesIndicatorResponse,
  EtfIndicatorResponse,
  IndicesIndicatorResponse,
  FundsIndicatorResponse,
  BondsIndicatorResponse,
  EconomyIndicatorResponse,
} from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { Indicator } from './indicators/indicator.service';
import { EconomyIndicator } from './indicators/economy-indicator.service';

export function createIndicator(data: IndicatorByTypeResponse): Indicator {
  const { indicatorType } = data;
  switch (indicatorType) {
    case 'stocks':
      return new StockIndicator(data as StocksIndicatorResponse);
    case 'forex_pairs':
      return new ForexPairIndicator(data as ForexPairsIndicatorResponse);
    case 'cryptocurrencies':
      return new CryptocurrencyIndicator(data as CryptocurrenciesIndicatorResponse);
    case 'etf':
      return new EtfIndicator(data as EtfIndicatorResponse);
    case 'indices':
      return new IndexIndicator(data as IndicesIndicatorResponse);
    case 'funds':
      return new FundIndicator(data as FundsIndicatorResponse);
    case 'bonds':
      return new BondIndicator(data as BondsIndicatorResponse);
    case 'economy':
      return new EconomyIndicator(data as EconomyIndicatorResponse);
    default:
      throw new Error('Invalid indicator type');
  }
}

export function convertIndicatorViewModel(data: IndicatorByTypeResponse[]): Indicator[] {
  return data.map((indicator) => createIndicator(indicator));
}
