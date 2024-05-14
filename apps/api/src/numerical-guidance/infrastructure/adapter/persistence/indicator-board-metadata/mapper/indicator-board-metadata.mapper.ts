import { IndicatorBoardMetadataEntity } from '../entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadata } from '../../../../../domain/indicator-board-metadata';
import { MemberEntity } from '../../../../../../auth/entity/member.entity';

export class IndicatorBoardMetadataMapper {
  static mapDomainToNewEntity(indicatorBoardMetaData: IndicatorBoardMetadata, member: MemberEntity) {
    const indicatorBoardMetadataEntity: IndicatorBoardMetadataEntity = new IndicatorBoardMetadataEntity();
    indicatorBoardMetadataEntity.indicatorBoardMetadataName = indicatorBoardMetaData.indicatorBoardMetadataName;
    indicatorBoardMetadataEntity.indicatorInfos = indicatorBoardMetaData.indicatorInfos;
    indicatorBoardMetadataEntity.customForecastIndicatorIds = indicatorBoardMetaData.customForecastIndicatorIds;
    indicatorBoardMetadataEntity.sections = indicatorBoardMetaData.sections;
    indicatorBoardMetadataEntity.member = member;
    indicatorBoardMetadataEntity.createdAt = indicatorBoardMetaData.createdAt;
    indicatorBoardMetadataEntity.updatedAt = indicatorBoardMetaData.updatedAt;
    return indicatorBoardMetadataEntity;
  }

  static mapEntityToDomain(entity: IndicatorBoardMetadataEntity) {
    return new IndicatorBoardMetadata(
      entity.id,
      entity.indicatorBoardMetadataName,
      entity.indicatorInfos,
      entity.customForecastIndicatorIds,
      this.createRecord(entity.sections),
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private static createRecord(data): Record<string, string[]> {
    const transformedData: Record<string, string[]> = {};

    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const values = data[key].split(',');
        transformedData[key] = values.filter((value) => value.trim() !== '');
      }
    }
    return transformedData;
  }
}
