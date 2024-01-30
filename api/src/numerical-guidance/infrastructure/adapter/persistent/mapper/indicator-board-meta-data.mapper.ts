import { MemberEntity } from '../../../../../auth/member.entity';
import { IndicatorBoardMetaDataEntity } from '../entity/indicator-board-meta-data.entity';

export class IndicatorBoardMetaDataMapper {
  static mapToEntity(indicatorBoardMetaDataName: string, indicators: Record<string, string[]>, memberId: number) {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetaDataEntity = new IndicatorBoardMetaDataEntity();
    indicatorBoardMetaDataEntity.indicatorBoardMetaDataName = indicatorBoardMetaDataName;
    indicatorBoardMetaDataEntity.indicators = indicators;
    indicatorBoardMetaDataEntity.member = MemberEntity.findById(memberId);
    return indicatorBoardMetaDataEntity;
  }
}
