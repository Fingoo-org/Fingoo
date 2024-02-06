import { MemberEntity } from '../../../../../auth/member.entity';
import { IndicatorBoardMetadataEntity } from '../entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

export class IndicatorBoardMetadataMapper {
  static mapDomainToEntity(indicatorBoardMetaData: IndicatorBoardMetadata) {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity = new IndicatorBoardMetadataEntity();
    indicatorBoardMetaDataEntity.indicatorBoardMetaDataName = indicatorBoardMetaData.indicatorBoardMetaDataName;
    indicatorBoardMetaDataEntity.indicators = indicatorBoardMetaData.indicatorIds;
    indicatorBoardMetaDataEntity.member = MemberEntity.findById(indicatorBoardMetaData.memberId);
    return indicatorBoardMetaDataEntity;
  }
}
