import { EconomyDto } from '../../../../../application/query/indicator/get-indicator-list/dto/economy.dto';
import { IndicatorType } from '../../../../../../utils/type/type-definition';
import { EconomyEntity } from '../entity/economy.entity';

export class EconomyMapper {
  static mapEntityToDto(entity): EconomyDto {
    return EconomyDto.create({
      id: entity.id,
      index: entity.index,
      indicatorType: entity.indicatorType as IndicatorType,
      symbol: entity.symbol,
      name: entity.name,
      frequency: entity.frequency,
      frequency_short: entity.frequency_short,
      units: entity.units,
      units_short: entity.units_short,
      seasonal_adjustment: entity.seasonal_adjustment,
      seasonal_adjustment_short: entity.seasonal_adjustment_short,
      notes: entity.notes,
    });
  }

  static mapDataToEntity(data): EconomyEntity {
    const economyEntity: EconomyEntity = new EconomyEntity();
    economyEntity.symbol = data.id;
    economyEntity.name = data.title;
    economyEntity.frequency = data.frequency;
    economyEntity.frequency_short = data.frequency_short;
    economyEntity.units = data.units;
    economyEntity.units_short = data.units_short;
    economyEntity.seasonal_adjustment = data.seasonal_adjustment;
    economyEntity.seasonal_adjustment_short = data.seasonal_adjustment_short;
    economyEntity.notes = data.notes;
    return economyEntity;
  }
}
