import { ApiProperty } from '@nestjs/swagger';
import { BondsDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/bonds.dto';
import { CryptoCurrenciesDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/crypto-currencies.dto';
import { ETFDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/etf.dto';
import { ForexPairDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/forex-pair.dto';
import { FundDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/fund.dto';
import { IndicesDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/indices.dto';
import { StockDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/stock.dto';
import { IndicatorType } from 'src/utils/type/type-definition';

export class SourceStockDto extends StockDto {
  @ApiProperty({
    example: '10',
    description: '가중치',
  })
  weight: number;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    country: string,
    currency: string,
    exchange: string,
    mic_code: string,
    type: string,
    weight: number,
  ) {
    super(id, index, indicatorType, symbol, name, country, currency, exchange, mic_code, type);
    this.weight = weight;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    name,
    country,
    currency,
    exchange,
    mic_code,
    type,
    weight,
  }): SourceStockDto {
    return new SourceStockDto(
      id,
      index,
      indicatorType,
      symbol,
      name,
      country,
      currency,
      exchange,
      mic_code,
      type,
      weight,
    );
  }
}

export class SourceIndicesDto extends IndicesDto {
  @ApiProperty({
    example: '10',
    description: '가중치',
  })
  weight: number;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    country: string,
    currency: string,
    exchange: string,
    mic_code: string,
    weight: number,
  ) {
    super(id, index, indicatorType, symbol, name, country, currency, exchange, mic_code);
    this.weight = weight;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    name,
    country,
    currency,
    exchange,
    mic_code,
    weight,
  }): SourceIndicesDto {
    return new SourceIndicesDto(id, index, indicatorType, symbol, name, country, currency, exchange, mic_code, weight);
  }
}

export class SourceFundDto extends FundDto {
  @ApiProperty({
    example: '10',
    description: '가중치',
  })
  weight: number;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    country: string,
    currency: string,
    exchange: string,
    type: string,
    weight: number,
  ) {
    super(id, index, indicatorType, symbol, name, country, currency, exchange, type);
    this.weight = weight;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    name,
    country,
    currency,
    exchange,
    type,
    weight,
  }): SourceFundDto {
    return new SourceFundDto(id, index, indicatorType, symbol, name, country, currency, exchange, type, weight);
  }
}

export class SourceForexPairDto extends ForexPairDto {
  @ApiProperty({
    example: '10',
    description: '가중치',
  })
  weight: number;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    currency_group: string,
    currency_base: string,
    currency_quote: string,
    weight: number,
  ) {
    super(id, index, indicatorType, symbol, currency_group, currency_base, currency_quote);
    this.weight = weight;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    currency_group,
    currency_base,
    currency_quote,
    weight,
  }): SourceForexPairDto {
    return new SourceForexPairDto(
      id,
      index,
      indicatorType,
      symbol,
      currency_group,
      currency_base,
      currency_quote,
      weight,
    );
  }
}

export class SourceETFDto extends ETFDto {
  @ApiProperty({
    example: '10',
    description: '가중치',
  })
  weight: number;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    country: string,
    currency: string,
    exchange: string,
    mic_code: string,
    weight: number,
  ) {
    super(id, index, indicatorType, symbol, name, country, currency, exchange, mic_code);
    this.weight = weight;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    name,
    country,
    currency,
    exchange,
    mic_code,
    weight,
  }): SourceETFDto {
    return new SourceETFDto(id, index, indicatorType, symbol, name, country, currency, exchange, mic_code, weight);
  }
}

export class SourceCryptoCurrenciesDto extends CryptoCurrenciesDto {
  @ApiProperty({
    example: '10',
    description: '가중치',
  })
  weight: number;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    available_exchanges: string[],
    currency_base: string,
    currency_quote: string,
    weight: number,
  ) {
    super(id, index, indicatorType, symbol, available_exchanges, currency_base, currency_quote);
    this.weight = weight;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    available_exchanges,
    currency_base,
    currency_quote,
    weight,
  }): SourceCryptoCurrenciesDto {
    return new SourceCryptoCurrenciesDto(
      id,
      index,
      indicatorType,
      symbol,
      available_exchanges,
      currency_base,
      currency_quote,
      weight,
    );
  }
}

export class SourceBondsDto extends BondsDto {
  @ApiProperty({
    example: '10',
    description: '가중치',
  })
  weight: number;

  constructor(
    id: string,
    index: number,
    indicatorType: IndicatorType,
    symbol: string,
    name: string,
    country: string,
    currency: string,
    exchange: string,
    type: string,
    weight: number,
  ) {
    super(id, index, indicatorType, symbol, name, country, currency, exchange, type);
    this.weight = weight;
  }

  public static create({
    id,
    index,
    indicatorType,
    symbol,
    name,
    country,
    currency,
    exchange,
    type,
    weight,
  }): SourceBondsDto {
    return new SourceBondsDto(id, index, indicatorType, symbol, name, country, currency, exchange, type, weight);
  }
}
