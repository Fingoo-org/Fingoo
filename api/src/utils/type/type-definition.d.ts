import { LiveStockDto } from '../../numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import { LiveEtfDto } from '../../numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-etf.dto';
import { LiveForexPairDto } from '../../numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-forex-pair.dto';
import { LiveIndicesDto } from '../../numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-indices.dto';
import { LiveBondsDto } from '../../numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-bonds.dto';
import { LiveFundDto } from '../../numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-fund.dto';
import { LiveCryptoCurrenciesDto } from '../../numerical-guidance/application/query/live-indicator/get-live-indicator/dto/live-crypto-currencies.dto';
import { CryptoCurrenciesDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/crypto-currencies.dto';
import { ETFDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/etf.dto';
import { ForexPairDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/forex-pair.dto';
import { IndicesDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/indices.dto';
import { StockDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/stock.dto';
import { FundDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/fund.dto';
import { BondsDto } from '../../numerical-guidance/application/query/indicator/get-indicator-list/dto/bonds.dto';

export type Interval = 'day' | 'week' | 'month' | 'year';

export type IndicatorType =
  | 'stocks'
  | 'forex_pairs'
  | 'cryptocurrencies'
  | 'etf'
  | 'indices'
  | 'customForecastIndicator'
  | 'funds'
  | 'bonds';

export type LiveIndicatorDtoType =
  | LiveStockDto
  | LiveEtfDto
  | LiveForexPairDto
  | LiveIndicesDto
  | LiveBondsDto
  | LiveFundDto
  | LiveCryptoCurrenciesDto;

export type IndicatorDtoType = CryptoCurrenciesDto | ETFDto | ForexPairDto | IndicesDto | StockDto | FundDto | BondsDto;

export type ForecastType = 'single' | 'multi';

export type SourceIndicatorInformation = {
  sourceIndicatorId: string;
  indicatorType: IndicatorType;
  weight: float;
};

export type TargetIndicatorInformation = {
  targetIndicatorId: string;
  targetIndicatorName: string;
  indicatorType: IndicatorType;
  exchange: string;
  symbol: string;
};

export type IndicatorValue = {
  date: string;
  value: string;
};

export type Verification = {
  indicatorId: string;
  verification: string;
};

export type ForecastApiResponse = {
  indicatorValues: IndicatorValue[];
  forecastType: ForecastType;
};

export type CustomForecastIndicatorValuesResponse = {
  customForecastIndicatorId: string;
  targetIndicatorId: string;
  type: IndicatorType;
  ticker: string;
  name: string;
  exchange: string;
  forecastType: ForecastType;
  customForecastIndicatorValues: IndicatorValue[];
  targetIndicatorValues: IndicatorValue[];
};
