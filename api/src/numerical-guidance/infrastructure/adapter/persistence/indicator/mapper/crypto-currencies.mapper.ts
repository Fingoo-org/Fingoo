import { CryptoCurrenciesEntity } from '../entity/crypto-currencies.entity';
import { CryptoCurrenciesDto } from '../../../../../application/query/indicator/dto/crypto-currencies.dto';

export class CryptoCurrenciesMapper {
  static mapEntityToDto(cryptoCurrenciesEntity: CryptoCurrenciesEntity): CryptoCurrenciesDto {
    return CryptoCurrenciesDto.create({
      id: cryptoCurrenciesEntity.id,
      index: cryptoCurrenciesEntity.index,
      indicatorType: cryptoCurrenciesEntity.indicatorType,
      symbol: cryptoCurrenciesEntity.symbol,
      available_exchanges: cryptoCurrenciesEntity.available_exchanges,
      currency_base: cryptoCurrenciesEntity.currency_base,
      currency_quote: cryptoCurrenciesEntity.currency_quote,
    });
  }

  static mapEntitiesToDtos(cryptoCurrenciesEntities: CryptoCurrenciesEntity[]): CryptoCurrenciesDto[] {
    return cryptoCurrenciesEntities.map((cryptoCurrenciesEntity) => {
      return CryptoCurrenciesMapper.mapEntityToDto(cryptoCurrenciesEntity);
    });
  }
}
