import { IndicatorBoardMetadataEntity } from '../entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { MemberEntity } from '../../../../../auth/member.entity';

export class IndicatorBoardMetadataMapper {
  static mapDomainToEntity(indicatorBoardMetaData: IndicatorBoardMetadata, member: MemberEntity) {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity = new IndicatorBoardMetadataEntity();
    indicatorBoardMetaDataEntity.indicatorBoardMetaDataName = indicatorBoardMetaData.indicatorBoardMetaDataName;
    indicatorBoardMetaDataEntity.indicators = indicatorBoardMetaData.indicatorIds;
    indicatorBoardMetaDataEntity.member = member;
    return indicatorBoardMetaDataEntity;
  }
}
