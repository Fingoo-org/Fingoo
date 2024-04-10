import { IndicesEntity } from '../entity/indices.entity';
import { IndicesDto } from '../../../../../application/query/indicator/dto/indices.dto';

export class IndicesMapper {
  static mapEntityToDto(indicesEntity: IndicesEntity): IndicesDto {
    return IndicesDto.create({
      id: indicesEntity.id,
      index: indicesEntity.index,
      indicatorType: indicesEntity.indicatorType,
      symbol: indicesEntity.symbol,
      name: indicesEntity.name,
      country: indicesEntity.country,
      currency: indicesEntity.currency,
      exchange: indicesEntity.exchange,
      mic_code: indicesEntity.mic_code,
    });
  }

  static mapEntitiesToDtos(indicesEntities: IndicesEntity[]): IndicesDto[] {
    return indicesEntities.map((indicesEntity) => {
      return IndicesMapper.mapEntityToDto(indicesEntity);
    });
  }
}
