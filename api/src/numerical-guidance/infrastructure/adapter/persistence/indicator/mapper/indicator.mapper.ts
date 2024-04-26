import { IndicatorEntity } from '../entity/indicator.entity';
import { Indicator, IndicatorDto } from 'src/numerical-guidance/application/query/indicator/basic/dto/indicator.dto';
import { IndicatorsDto } from '../../../../../application/query/indicator/basic/dto/indicators.dto';

export class IndicatorMapper {
  static mapEntityToDto(indicatorEntity: IndicatorEntity): IndicatorDto {
    const indicator: Indicator = {
      id: indicatorEntity.id,
      name: indicatorEntity.name,
      ticker: indicatorEntity.ticker,
      type: indicatorEntity.type,
      exchange: indicatorEntity.exchange,
    };
    return IndicatorDto.create(indicator);
  }

  static mapEntitiesToDto(indicatorEntities: IndicatorEntity[]): IndicatorsDto {
    const indicators: Indicator[] = indicatorEntities.map((indicatorEntity) => {
      const mappedEntity = IndicatorMapper.mapEntityToDto(indicatorEntity);
      return mappedEntity.indicator;
    });
    return IndicatorsDto.create(indicators);
  }
}
