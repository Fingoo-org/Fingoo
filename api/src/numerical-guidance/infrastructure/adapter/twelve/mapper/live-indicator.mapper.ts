import { LiveStockDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import { LiveEtfDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-etf.dto';
import { LiveIndicesDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-indices.dto';
import { LiveFundDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-fund.dto';
import { LiveBondsDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-bonds.dto';
import { LiveForexPairDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-forex-pair.dto';
import { LiveCryptoCurrenciesDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-crypto-currencies.dto';

export class LiveIndicatorMapper {
  static mapToDto(indicatorType: string, redisData: string) {
    const DtoType = this.findDtoType(indicatorType);
    return DtoType.create(JSON.parse(redisData));
  }

  private static findDtoType(type: string) {
    switch (type) {
      case 'etf':
        return LiveEtfDto;
      case 'indices':
        return LiveIndicesDto;
      case 'stocks':
        return LiveStockDto;
      case 'funds':
        return LiveFundDto;
      case 'bonds':
        return LiveBondsDto;
      case 'forex_pairs':
        return LiveForexPairDto;
      case 'cryptocurrencies':
        return LiveCryptoCurrenciesDto;
    }
  }
}
