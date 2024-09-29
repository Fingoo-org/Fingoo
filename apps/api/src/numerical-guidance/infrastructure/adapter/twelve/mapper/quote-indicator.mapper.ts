import { QuoteEtfDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-etf.dto';
import { QuoteIndiceDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-indice.dto';
import { QuoteStockDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-stock.dto';
import { QuoteFundDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-fund.dto';
import { NotImplementedException } from '@nestjs/common';
import { QuoteForexPairDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-forex-pair.dto';
import { QuoteCryptoCurrencyDto } from '../../../../application/query/quote-indicator/get-quote-indicator/dto/quote-crypto-currency.dto';

export class QuoteIndicatorMapper {
  static mapStringToDto(indicatorType: string, quoteObject: string) {
    const DtoType = this.findDtoType(indicatorType);
    return DtoType.create(JSON.parse(quoteObject));
  }

  static mapObjectToDto(indicatorType: string, quoteObject) {
    const DtoType = this.findDtoType(indicatorType);
    return DtoType.create(quoteObject);
  }

  private static findDtoType(type: string) {
    switch (type) {
      case 'etf':
        return QuoteEtfDto;
      case 'indices':
        return QuoteIndiceDto;
      case 'stocks':
        return QuoteStockDto;
      case 'funds':
        return QuoteFundDto;
      case 'bonds':
        throw new NotImplementedException('[WARNING] bonds is not implement');
      case 'commodity_pairs':
        throw new NotImplementedException('[WARNING] commodity_pairs is not implement');
      case 'forex_pairs':
        return QuoteForexPairDto;
      case 'cryptocurrencies':
        return QuoteCryptoCurrencyDto;
      case 'economy':
        throw new NotImplementedException('[WARNING] economy is not implement');
      default:
        throw new NotImplementedException('[WARNING] none is not implement');
    }
  }
}
