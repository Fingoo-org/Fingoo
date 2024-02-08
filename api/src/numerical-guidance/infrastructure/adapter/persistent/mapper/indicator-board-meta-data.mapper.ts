import { MemberEntity } from '../../../../../auth/member.entity';
import { IndicatorBoardMetaDataEntity } from '../entity/indicator-board-meta-data.entity';
import { IndicatorBoardMetaData } from '../../../../domain/indicator-board-meta-data';

export class IndicatorBoardMetaDataMapper {
  static mapDomainToEntity(indicatorBoardMetaData: IndicatorBoardMetaData) {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetaDataEntity = new IndicatorBoardMetaDataEntity();
    indicatorBoardMetaDataEntity.indicatorBoardMetaDataName = indicatorBoardMetaData.indicatorBoardMetaDataName;
    indicatorBoardMetaDataEntity.indicators = indicatorBoardMetaData.indicatorIds;
    indicatorBoardMetaDataEntity.member = MemberEntity.findById(indicatorBoardMetaData.memberId);
    return indicatorBoardMetaDataEntity;
  }

  static async mapEntityToDomain(entity: IndicatorBoardMetaDataEntity) {
    const member = await entity.member;
    const memberId = member.id;
    const indicatorBoardMetaData = IndicatorBoardMetaData.createNew(
      entity.indicatorBoardMetaDataName,
      entity.indicators,
      memberId,
    );
    return indicatorBoardMetaData;
  }
}
