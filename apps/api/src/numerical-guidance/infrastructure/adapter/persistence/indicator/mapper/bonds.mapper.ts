import { BondsEntity } from '../entity/bonds.entity';
import { BondsDto } from '../../../../../application/query/indicator/get-indicator-list/dto/bonds.dto';

export class BondsMapper {
  static mapEntityToDto(bondsEntity: BondsEntity): BondsDto {
    return BondsDto.create({
      id: bondsEntity.id,
      index: bondsEntity.index,
      indicatorType: bondsEntity.indicatorType,
      symbol: bondsEntity.symbol,
      name: bondsEntity.name,
      country: bondsEntity.country,
      currency: bondsEntity.currency,
      exchange: bondsEntity.exchange,
      type: bondsEntity.type,
    });
  }

  static mapEntitiesToDtos(bondsEntities: BondsEntity[]): BondsDto[] {
    return bondsEntities.map((bondsEntity) => {
      return BondsMapper.mapEntityToDto(bondsEntity);
    });
  }
}
