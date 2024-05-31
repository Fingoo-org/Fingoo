import { IndicatorDtoType, IndicatorType } from '../../../../../../utils/type/type-definition';
import { CryptoCurrenciesDto } from '../../../../../application/query/indicator/get-indicator-list/dto/crypto-currencies.dto';
import { ETFDto } from '../../../../../application/query/indicator/get-indicator-list/dto/etf.dto';
import { ForexPairDto } from '../../../../../application/query/indicator/get-indicator-list/dto/forex-pair.dto';
import { IndicesDto } from '../../../../../application/query/indicator/get-indicator-list/dto/indices.dto';
import { StockDto } from '../../../../../application/query/indicator/get-indicator-list/dto/stock.dto';
import { FundDto } from '../../../../../application/query/indicator/get-indicator-list/dto/fund.dto';
import { BondsDto } from '../../../../../application/query/indicator/get-indicator-list/dto/bonds.dto';
import { CryptoCurrenciesMapper } from './crypto-currencies.mapper';
import { BondsMapper } from './bonds.mapper';
import { ForexPairMapper } from './forex-pair.mapper';
import { StockMapper } from './stock.mapper';
import { FundMapper } from './fund.mapper';
import { IndicesMapper } from './indices.mapper';
import { ETFMapper } from './etf.mapper';
import { EconomyMapper } from './economy.mapper';
import { EconomyDto } from '../../../../../application/query/indicator/get-indicator-list/dto/economy.dto';

export class IndicatorMapper {
  static mapEntitiesToDtosByType(
    type: IndicatorType,
    indicatorEntities,
  ): CryptoCurrenciesDto[] | ETFDto[] | ForexPairDto[] | IndicesDto[] | StockDto[] | FundDto[] | BondsDto[] {
    switch (type) {
      case 'cryptocurrencies':
        return CryptoCurrenciesMapper.mapEntitiesToDtos(indicatorEntities);
      case 'etf':
        return ETFMapper.mapEntitiesToDtos(indicatorEntities);
      case 'forex_pairs':
        return ForexPairMapper.mapEntitiesToDtos(indicatorEntities);
      case 'indices':
        return IndicesMapper.mapEntitiesToDtos(indicatorEntities);
      case 'stocks':
        return StockMapper.mapEntitiesToDtos(indicatorEntities);
      case 'funds':
        return FundMapper.mapEntitiesToDtos(indicatorEntities);
      case 'bonds':
        return BondsMapper.mapEntitiesToDtos(indicatorEntities);
    }
  }

  static mapEntityToDtoByType(type: IndicatorType, indicatorEntity): IndicatorDtoType {
    switch (type) {
      case 'cryptocurrencies':
        return CryptoCurrenciesMapper.mapEntityToDto(indicatorEntity);
      case 'etf':
        return ETFMapper.mapEntityToDto(indicatorEntity);
      case 'forex_pairs':
        return ForexPairMapper.mapEntityToDto(indicatorEntity);
      case 'indices':
        return IndicesMapper.mapEntityToDto(indicatorEntity);
      case 'stocks':
        return StockMapper.mapEntityToDto(indicatorEntity);
      case 'funds':
        return FundMapper.mapEntityToDto(indicatorEntity);
      case 'bonds':
        return BondsMapper.mapEntityToDto(indicatorEntity);
      case 'economy':
        return EconomyMapper.mapEntityToDto(indicatorEntity);
    }
  }

  static dtoHandler(type: IndicatorType): IndicatorDtoType {
    const dtos = {
      cryptocurrencies: CryptoCurrenciesDto,
      etf: ETFDto,
      forex_pairs: ForexPairDto,
      indices: IndicesDto,
      stocks: StockDto,
      funds: FundDto,
      bonds: BondsDto,
      economy: EconomyDto,
    };

    return dtos[type];
  }
}
