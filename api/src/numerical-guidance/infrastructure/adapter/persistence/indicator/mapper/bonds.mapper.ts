import { BondsEntity } from '../entity/bonds.entity';
import { BondsDto } from '../../../../../application/query/indicator/dto/bonds.dto';

export class BondsMapper {
  static mapEntityToDto(indicatorEntity: BondsEntity): BondsDto {
    return {
      id: indicatorEntity.id,
      index: indicatorEntity.index,
      indicatorType: indicatorEntity.indicatorType,
      symbol: indicatorEntity.symbol,
      name: indicatorEntity.name,
      country: indicatorEntity.country,
      currency: indicatorEntity.currency,
      exchange: indicatorEntity.exchange,
      type: indicatorEntity.type,
    };
  }

  static mapEntitiesToDto(bondsEntities: BondsEntity[]): BondsDto[] {
    return bondsEntities.map((bondsEntity) => {
      return BondsMapper.mapEntityToDto(bondsEntity);
    });
  }
}
