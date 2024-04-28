import { LiveIndicatorDtoType } from '../../../../../utils/type/type-definition';
import { LiveEtfDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-etf.dto';
import { LiveIndicesDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-indices.dto';
import { LiveStockDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import { LiveFundDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-fund.dto';
import { LiveBondsDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-bonds.dto';
import { LiveCryptoCurrenciesDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-crypto-currencies.dto';
import { LiveForexPairDto } from '../../../../application/query/live-indicator/get-live-indicator/dto/live-forex-pair.dto';

export class IndicatorTwelveMapper {
  static mapToIndicatorDtoByType(indicatorDto, adjustedValuesByInterval, responseData): LiveIndicatorDtoType {
    const baseLiveIndicatorData = {
      indicatorId: indicatorDto.id,
      type: indicatorDto.indicatorType,
      symbol: indicatorDto.symbol,
      name: this.getIndicatorNameByType(indicatorDto),
      exchange: indicatorDto.exchange,
      totalCount: adjustedValuesByInterval.length,
      values: adjustedValuesByInterval,
    };
    switch (indicatorDto.indicatorType) {
      case 'etf':
        return LiveEtfDto.create(baseLiveIndicatorData);
      case 'indices':
        return LiveIndicesDto.create(baseLiveIndicatorData);
      case 'stocks':
        return LiveStockDto.create(baseLiveIndicatorData);
      case 'funds':
        return LiveFundDto.create(baseLiveIndicatorData);
      case 'bonds':
        return LiveBondsDto.create(baseLiveIndicatorData);
      case 'cryptocurrencies':
        return LiveCryptoCurrenciesDto.create({
          id: indicatorDto.id,
          symbol: indicatorDto.symbol,
          type: indicatorDto.indicatorType,
          currency_base: responseData.meta.currency_base,
          totalCount: adjustedValuesByInterval.length,
          values: adjustedValuesByInterval,
        });
      case 'forex_pairs':
        return LiveForexPairDto.create({
          id: indicatorDto.id,
          symbol: indicatorDto.symbol,
          type: indicatorDto.indicatorType,
          currency_group: responseData.meta.currency_group,
          currency_base: responseData.meta.currency_base,
          currency_quote: responseData.meta.currency_quote,
          totalCount: adjustedValuesByInterval.length,
          values: adjustedValuesByInterval,
        });
    }
  }

  private static getIndicatorNameByType(indicatorDto): string {
    if (indicatorDto.type == 'cryptocurrencies') {
      return indicatorDto.symbol;
    }
    return indicatorDto.name;
  }
}
