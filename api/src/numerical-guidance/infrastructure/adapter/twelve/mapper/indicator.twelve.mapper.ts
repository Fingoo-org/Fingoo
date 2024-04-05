import { BondsDto } from '../../../../application/query/indicator/dto/bonds.dto';
import { IndicatorType } from '../../../../../utils/type/type-definition';

export class IndicatorTwelveMapper {
  static mapToDto(type: IndicatorType, data: any) {
    switch (type) {
      case 'stocks':
      // return StocksDto.create(data);
      case 'forex_pairs':
      // return ForexPairsDto.create(data);
      case 'cryptocurrencies':
      // return CryptocurrenciesDto.create(data);
      case 'etf':
      // return EtfDto.create(data);
      case 'indices':
      // return IndicesDto.create(data);
      case 'customForecastIndicator':
      // return CustomForecastIndicatorDto.create(data);
      case 'funds':
      // return FundsDto.create(data);
      case 'bonds':
        return BondsDto.create(data);
      case 'exchanges':
      // return ExchangesDto.create(data);
      case 'cryptocurrency_exchanges':
      // return CryptocurrencyExchangesDto.create(data);
      default:
        throw new Error(`Invalid IndicatorType: ${type}`);
    }
  }
}
