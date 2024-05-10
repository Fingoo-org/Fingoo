import { StockDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/stock.dto';
import {
  SourceBondsDto,
  SourceCryptoCurrenciesDto,
  SourceETFDto,
  SourceForexPairDto,
  SourceFundDto,
  SourceIndicesDto,
  SourceStockDto,
} from '../dto/source-indicator.dto';
import { IndicesDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/indices.dto';
import { FundDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/fund.dto';
import { ForexPairDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/forex-pair.dto';
import { ETFDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/etf.dto';
import { CryptoCurrenciesDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/crypto-currencies.dto';
import { BondsDto } from 'src/numerical-guidance/application/query/indicator/get-indicator-list/dto/bonds.dto';

export class SourceIndicatorMapper {
  public static mapStockDtoToSourceDto(stockDto: StockDto, weight: number) {
    const sourceDto = SourceStockDto.create({
      id: stockDto.id,
      country: stockDto.country,
      currency: stockDto.currency,
      exchange: stockDto.exchange,
      index: stockDto.index,
      indicatorType: stockDto.indicatorType,
      mic_code: stockDto.mic_code,
      name: stockDto.name,
      symbol: stockDto.symbol,
      type: stockDto.type,
      weight: weight,
    });
    return sourceDto;
  }

  public static mapIndicesDtoToSourceDto(indicesDto: IndicesDto, weight: number) {
    const sourceDto = SourceIndicesDto.create({
      id: indicesDto.id,
      index: indicesDto.index,
      indicatorType: indicesDto.indicatorType,
      symbol: indicesDto.symbol,
      name: indicesDto.name,
      country: indicesDto.country,
      currency: indicesDto.currency,
      exchange: indicesDto.exchange,
      mic_code: indicesDto.mic_code,
      weight: weight,
    });
    return sourceDto;
  }

  public static mapFundDtoToSourceDto(fundDto: FundDto, weight: number) {
    const sourceDto = SourceFundDto.create({
      id: fundDto.id,
      index: fundDto.index,
      indicatorType: fundDto.indicatorType,
      symbol: fundDto.symbol,
      name: fundDto.name,
      country: fundDto.country,
      currency: fundDto.currency,
      exchange: fundDto.exchange,
      type: fundDto.type,
      weight: weight,
    });
    return sourceDto;
  }

  public static mapForexPairDtoETFDto(forexPairDto: ForexPairDto, weight: number) {
    const sourceDto = SourceForexPairDto.create({
      id: forexPairDto.id,
      index: forexPairDto.index,
      indicatorType: forexPairDto.indicatorType,
      symbol: forexPairDto.symbol,
      currency_group: forexPairDto.currency_group,
      currency_base: forexPairDto.currency_base,
      currency_quote: forexPairDto.currency_quote,
      weight: weight,
    });
    return sourceDto;
  }

  public static mapETFDtoSourceDto(etfDto: ETFDto, weight: number) {
    const sourceDto = SourceETFDto.create({
      id: etfDto.id,
      index: etfDto.index,
      indicatorType: etfDto.indicatorType,
      symbol: etfDto.symbol,
      name: etfDto.name,
      country: etfDto.country,
      currency: etfDto.currency,
      exchange: etfDto.exchange,
      mic_code: etfDto.mic_code,
      weight: weight,
    });
    return sourceDto;
  }

  public static mapCryptoCurrenciesDtoToSourceDto(cryptoCurrenciesDto: CryptoCurrenciesDto, weight: number) {
    const sourceDto = SourceCryptoCurrenciesDto.create({
      id: cryptoCurrenciesDto.id,
      index: cryptoCurrenciesDto.index,
      indicatorType: cryptoCurrenciesDto.indicatorType,
      symbol: cryptoCurrenciesDto.symbol,
      available_exchanges: cryptoCurrenciesDto.available_exchanges,
      currency_base: cryptoCurrenciesDto.currency_base,
      currency_quote: cryptoCurrenciesDto.currency_quote,
      weight: weight,
    });
    return sourceDto;
  }

  public static mapBondsDtoToSourceDto(bonndsDto: BondsDto, weight: number) {
    const sourceDto = SourceBondsDto.create({
      id: bonndsDto.id,
      index: bonndsDto.index,
      indicatorType: bonndsDto.indicatorType,
      symbol: bonndsDto.symbol,
      name: bonndsDto.name,
      country: bonndsDto.country,
      currency: bonndsDto.currency,
      exchange: bonndsDto.exchange,
      type: bonndsDto.type,
      weight: weight,
    });
    return sourceDto;
  }

  public static createSourceIndicatorInformation(indicatorDtoType, weight: number) {
    const type = indicatorDtoType.indicatorType;
    switch (type) {
      case 'stocks':
        return this.mapStockDtoToSourceDto(indicatorDtoType, weight);
      case 'forex_pairs':
        return this.mapForexPairDtoETFDto(indicatorDtoType, weight);
      case 'cryptocurrencies':
        return this.mapCryptoCurrenciesDtoToSourceDto(indicatorDtoType, weight);
      case 'etf':
        return this.mapETFDtoSourceDto(indicatorDtoType, weight);
      case 'indices':
        return this.mapIndicesDtoToSourceDto(indicatorDtoType, weight);
      case 'funds':
        return this.mapFundDtoToSourceDto(indicatorDtoType, weight);
      case 'bonds':
        return this.mapBondsDtoToSourceDto(indicatorDtoType, weight);
    }
  }
}
