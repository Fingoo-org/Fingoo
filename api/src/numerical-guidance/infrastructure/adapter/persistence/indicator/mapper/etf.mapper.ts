import { ETFEntity } from '../entity/etf.entity';
import { ETFDto } from '../../../../../application/query/indicator/dto/etf.dto';

export class ETFMapper {
  static mapEntityToDto(etfEntity: ETFEntity): ETFDto {
    return ETFDto.create({
      id: etfEntity.id,
      index: etfEntity.index,
      indicatorType: etfEntity.indicatorType,
      symbol: etfEntity.symbol,
      name: etfEntity.name,
      country: etfEntity.country,
      currency: etfEntity.currency,
      exchange: etfEntity.exchange,
      mic_code: etfEntity.mic_code,
    });
  }

  static mapEntitiesToDto(etfEntities: ETFEntity[]): ETFDto[] {
    return etfEntities.map((etfEntity) => {
      return ETFMapper.mapEntityToDto(etfEntity);
    });
  }
}
