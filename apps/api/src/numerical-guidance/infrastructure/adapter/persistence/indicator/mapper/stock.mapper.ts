import { StockEntity } from '../entity/stock.entity';
import { StockDto } from '../../../../../application/query/indicator/get-indicator-list/dto/stock.dto';

export class StockMapper {
  static mapEntityToDto(stockEntity: StockEntity): StockDto {
    return StockDto.create({
      id: stockEntity.id,
      index: stockEntity.index,
      indicatorType: stockEntity.indicatorType,
      symbol: stockEntity.symbol,
      name: stockEntity.name,
      country: stockEntity.country,
      currency: stockEntity.currency,
      exchange: stockEntity.exchange,
      mic_code: stockEntity.mic_code,
      type: stockEntity.type,
    });
  }

  static mapEntitiesToDtos(stockEntities: StockEntity[]): StockDto[] {
    return stockEntities.map((stockEntity) => {
      return StockMapper.mapEntityToDto(stockEntity);
    });
  }
}
