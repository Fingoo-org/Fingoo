import { ApiProperty } from '@nestjs/swagger';
import { IndicatorType } from '../../../../../utils/type/type-definition';

export class CryptoCurrenciesDto {
  @ApiProperty({
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    description: '지표 id',
  })
  id: string;

  @ApiProperty({
    example: 1,
    description: '지표 인덱스(페이지네이션 id)',
  })
  index: number;

  @ApiProperty({
    example: 'cryptocurrencies',
    description: '지표 타입',
  })
  indicatorType: IndicatorType;

  @ApiProperty({
    example: '0P00000AMG',
    description: '지표 심볼',
  })
  symbol: string;

  @ApiProperty({
    example: [
      'ABCC',
      'Allcoin',
      'BTC-Alpha',
      'BTCTurk',
      'Bibox',
      'BigONE',
      'Binance',
      'Bit-Z',
      'BitForex',
      'BitMEX',
      'BitMart',
      'BitMax',
      'BitStamp',
      'Bitex.la',
      'Bitfinex',
      'Bitibu',
      'Bitinka',
      'Bitlish',
      'Bitrue',
      'Bittrex',
      'Btcwinex',
      'C2CX',
      'CBX',
      'CEX.IO',
      'COINEGG',
      'Cobinhood',
      'CoinAll',
      'CoinField',
      'CoinHub',
      'CoinTiger',
      'Coinbase Pro',
      'Coinbene',
      'CoinsBank',
      'Coinsbit',
      'CryptalDash',
      'DragonEX',
      'EXX',
      'Exmo',
      'Exrates',
      'GDAX',
      'Gate.io',
      'Gemini',
      'HitBTC',
      'Huobi',
      'IDAX',
      'IDCM',
      'Independent Reserve',
      'Kraken',
      'Kryptono',
      'Kucoin',
      'LBank',
      'LakeBTC',
      'Livecoin',
      'OKCoin',
      'OKEx',
      'OOOBTC',
      'Panxora',
      'Poloniex',
      'QUOINE',
      'SIMEX',
      'Tidex',
      'Upbit',
      'YoBit',
      'ZB.COM',
      'bitFlyer',
      'itBit',
      'n.exchange',
      'p2pb2b',
      'xBTCe',
    ],
    description: '암호화폐가 거래되는 거래소의 목록',
  })
  available_exchanges: string[];

  @ApiProperty({
    example: 'Bitcoin',
    description: '기초통화로 사용되는 화폐',
  })
  currency_base: string;

  @ApiProperty({
    example: 'US Dollar',
    description: '인용통화로 사용되는 화폐',
  })
  currency_quote: string;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    available_exchanges: string[],
    currency_base: string,
    currency_quote: string,
  ) {
    this.id = id;
    this.index = index;
    this.indicatorType = indicatorType;
    this.symbol = symbol;
    this.available_exchanges = available_exchanges;
    this.currency_base = currency_base;
    this.currency_quote = currency_quote;
  }

  public static create({ id, index, indicatorType, symbol, available_exchanges, currency_base, currency_quote }) {
    return new CryptoCurrenciesDto(
      id,
      index,
      indicatorType,
      symbol,
      available_exchanges,
      currency_base,
      currency_quote,
    );
  }
}
