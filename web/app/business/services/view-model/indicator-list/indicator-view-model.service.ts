import {
  indicatorByTypeResponse,
  StocksIndicatorResponse,
  ForexPairsIndicatorResponse,
  CryptocurrenciesIndicatorResponse,
  EtfIndicatorResponse,
  IndicesIndicatorResponse,
  FundsIndicatorResponse,
  BondsIndicatorResponse,
} from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import { StockIndicator } from './indicators/stock-indicator.service';
import { ForexPairIndicator } from './indicators/forex-pair-indicator.service';
import { CryptocurrencyIndicator } from './indicators/cryptocurrency-indicator.service';
import { IndexIndicator } from './indicators/index-indicator.service';
import { FundIndicator } from './indicators/fund-indicator.service';
import { BondIndicator } from './indicators/bond-indicator.service';
import { EtfIndicator } from './indicators/etf-indicator.service';

export abstract class Indicator {
  readonly id: String;
  readonly indicatorType: IndicatorType;

  constructor(id: String, indicatorType: IndicatorType) {
    this.id = id;
    this.indicatorType = indicatorType;
  }

  abstract get symbol(): String;

  abstract get name(): String;

  abstract get exchange(): String;
}

function createIndicator(indicatorType: IndicatorType, data: indicatorByTypeResponse): Indicator {
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
    default:
      throw new Error('Invalid indicator type');
  }
}

export function convertIndicatorViewModel(data: indicatorByTypeResponse[]): Indicator[] {
  return data.map((indicator) => createIndicator(indicator.indicatorType, indicator));
}
