import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorEntity } from '../entity/custom-forecast-indicator.entity';
import { MemberEntity } from 'src/auth/member.entity';

export class CustomForecastIndicatorMapper {
  static mapDomainToNewEntity(
    customForecastIndicator: CustomForecastIndicator,
    member: MemberEntity,
  ): CustomForecastIndicatorEntity {
    const customForecastIndicatorEntity: CustomForecastIndicatorEntity = CustomForecastIndicatorEntity.createNew(
      customForecastIndicator.customForecastIndicatorName,
      customForecastIndicator.type,
      customForecastIndicator.targetIndicatorInformation,
      customForecastIndicator.grangerVerification,
      customForecastIndicator.cointJohansenVerification,
      customForecastIndicator.sourceIndicatorsInformation,
      member,
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
      entity.targetIndicatorInformation,
      entity.grangerVerification,
      entity.cointJohansenVerification,
      entity.sourceIndicatorsInformation,
    );
    return customForecastIndicator;
  }
}
