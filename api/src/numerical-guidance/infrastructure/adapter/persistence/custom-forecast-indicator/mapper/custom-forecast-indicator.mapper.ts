import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorEntity } from '../entity/custom-forecast-indicator.entity';

export class CustomForecastIndicatorMapper {
  static mapDomainToEntity(customForecastIndicator: CustomForecastIndicator): CustomForecastIndicatorEntity {
    const customForecastIndicatorEntity: CustomForecastIndicatorEntity = new CustomForecastIndicatorEntity();
    customForecastIndicatorEntity.id = customForecastIndicator.id;
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
}
