import { FundEntity } from '../entity/fund.entity';
import { FundDto } from '../../../../../application/query/indicator/dto/fund.dto';

export class FundMapper {
  static mapEntityToDto(fundEntity: FundEntity): FundDto {
    return FundDto.create({
      id: fundEntity.id,
      index: fundEntity.index,
      indicatorType: fundEntity.indicatorType,
      symbol: fundEntity.symbol,
      name: fundEntity.name,
      country: fundEntity.country,
      currency: fundEntity.currency,
      exchange: fundEntity.exchange,
      type: fundEntity.type,
    });
  }

  static mapEntitiesToDtos(fundEntities: FundEntity[]): FundDto[] {
    return fundEntities.map((fundEntity) => {
      return FundMapper.mapEntityToDto(fundEntity);
    });
  }
}
