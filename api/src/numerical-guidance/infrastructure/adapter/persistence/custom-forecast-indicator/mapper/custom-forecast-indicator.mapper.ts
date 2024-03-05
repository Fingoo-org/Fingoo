import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorEntity } from '../entity/custom-forecast-indicator.entity';

export class CustomForecastIndicatorMapper {
  static mapDomainToEntity(customForecastIndicator: CustomForecastIndicator): CustomForecastIndicatorEntity {
    const customForecastIndicatorEntity: CustomForecastIndicatorEntity = new CustomForecastIndicatorEntity();
    customForecastIndicatorEntity.customForecastIndicatorName = customForecastIndicator.customForecastIndicatorName;
    customForecastIndicatorEntity.type = customForecastIndicator.type;
    customForecastIndicatorEntity.targetIndicatorId = customForecastIndicator.targetIndicatorId;
    customForecastIndicatorEntity.grangerVerification = customForecastIndicator.grangerVerification;
    customForecastIndicatorEntity.cointJohansenVerification = customForecastIndicator.cointJohansenVerification;
    customForecastIndicatorEntity.sourceIndicatorIdsAndWeights = customForecastIndicator.sourceIndicatorIdsAndWeights;
    customForecastIndicatorEntity.createdAt = customForecastIndicator.createdAt;
    customForecastIndicatorEntity.updatedAt = customForecastIndicator.updatedAt;

    return customForecastIndicatorEntity;
  }

  static mapEntityToDomain(entity: CustomForecastIndicatorEntity): CustomForecastIndicator {
    const {
      id,
      customForecastIndicatorName,
      type,
      targetIndicatorId,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
    } = entity;
    const customForecastIndicator: CustomForecastIndicator = new CustomForecastIndicator(
      id,
      customForecastIndicatorName,
      type,
      targetIndicatorId,
      grangerVerification,
      cointJohansenVerification,
      sourceIndicatorIdsAndWeights,
    );
    return customForecastIndicator;
  }
}
