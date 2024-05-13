import { ForexPairEntity } from '../entity/forex-pair.entity';
import { ForexPairDto } from '../../../../../application/query/indicator/get-indicator-list/dto/forex-pair.dto';

export class ForexPairMapper {
  static mapEntityToDto(forexPairEntity: ForexPairEntity): ForexPairDto {
    return ForexPairDto.create({
      id: forexPairEntity.id,
      index: forexPairEntity.index,
      indicatorType: forexPairEntity.indicatorType,
      symbol: forexPairEntity.symbol,
      currency_group: forexPairEntity.currency_group,
      currency_base: forexPairEntity.currency_base,
      currency_quote: forexPairEntity.currency_quote,
    });
  }

  static mapEntitiesToDtos(forexPairEntities: ForexPairEntity[]): ForexPairDto[] {
    return forexPairEntities.map((forexPairEntity) => {
      return ForexPairMapper.mapEntityToDto(forexPairEntity);
    });
  }
}
