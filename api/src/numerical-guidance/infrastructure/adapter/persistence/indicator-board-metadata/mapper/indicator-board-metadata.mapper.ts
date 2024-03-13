import { IndicatorBoardMetadataEntity } from '../entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadata } from '../../../../../domain/indicator-board-metadata';
import { MemberEntity } from '../../../../../../auth/member.entity';

export class IndicatorBoardMetadataMapper {
  static mapDomainToEntity(indicatorBoardMetaData: IndicatorBoardMetadata, member: MemberEntity) {
    const indicatorBoardMetadataEntity: IndicatorBoardMetadataEntity = new IndicatorBoardMetadataEntity();
    indicatorBoardMetadataEntity.indicatorBoardMetadataName = indicatorBoardMetaData.indicatorBoardMetadataName;
    indicatorBoardMetadataEntity.indicatorIds = { indicatorIds: indicatorBoardMetaData.indicatorIds };
    indicatorBoardMetadataEntity.member = member;
    indicatorBoardMetadataEntity.createdAt = indicatorBoardMetaData.createdAt;
    indicatorBoardMetadataEntity.updatedAt = indicatorBoardMetaData.updatedAt;
    return indicatorBoardMetadataEntity;
  }

  static mapEntityToDomain(entity: IndicatorBoardMetadataEntity) {
    return new IndicatorBoardMetadata(
      entity.id,
      entity.indicatorBoardMetadataName,
      this.createArray(entity.indicatorIds['indicatorIds'].toString()),
      entity.createdAt,
      entity.updatedAt,
    );
  }

  private static createArray(stringArray: string) {
    if (stringArray.length == 0 || stringArray == '') {
      return [];
    }
    return stringArray.split(',');
  }
}
