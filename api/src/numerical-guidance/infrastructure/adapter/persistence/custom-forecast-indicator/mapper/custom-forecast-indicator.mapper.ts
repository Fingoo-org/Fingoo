import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorEntity } from '../entity/custom-forecast-indicator.entity';

export class CustomForecastIndicatorMapper {
  static mapDomainToEntity(customForecastIndicator: CustomForecastIndicator): CustomForecastIndicatorEntity {
    const customForecastIndicatorEntity: CustomForecastIndicatorEntity = CustomForecastIndicatorEntity.createNew(
      customForecastIndicator.customForecastIndicatorName,
      customForecastIndicator.type,
      customForecastIndicator.targetIndicatorId,
      customForecastIndicator.grangerVerification,
      customForecastIndicator.cointJohansenVerification,
      customForecastIndicator.sourceIndicatorIdsAndWeights,
      customForecastIndicator.createdAt,
      customForecastIndicator.updatedAt,
    );
    return customForecastIndicatorEntity;
  }

  static mapEntityToDomain(entity: CustomForecastIndicatorEntity): CustomForecastIndicator {
    const customForecastIndicator: CustomForecastIndicator = new CustomForecastIndicator(
      entity.id,
      entity.customForecastIndicatorName,
      entity.type,
      entity.targetIndicatorId,
      entity.grangerVerification,
      entity.cointJohansenVerification,
      entity.sourceIndicatorIdsAndWeights,
    );
    return customForecastIndicator;
  }
}
