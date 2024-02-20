import { IndicatorBoardMetadataEntity } from '../entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';
import { MemberEntity } from '../../../../../auth/member.entity';

export class IndicatorBoardMetadataMapper {
  static mapDomainToEntity(indicatorBoardMetaData: IndicatorBoardMetadata, member: MemberEntity) {
    const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity = new IndicatorBoardMetadataEntity();
    indicatorBoardMetaDataEntity.indicatorBoardMetaDataName = indicatorBoardMetaData.indicatorBoardMetaDataName;
    indicatorBoardMetaDataEntity.tickers = indicatorBoardMetaData.tickers;
    indicatorBoardMetaDataEntity.member = member;
    return indicatorBoardMetaDataEntity;
  }

  static mapEntityToDomain(entity: IndicatorBoardMetadataEntity) {
    const indicatorBoardMetaData = new IndicatorBoardMetadata(
      entity.id,
      entity.indicatorBoardMetaDataName,
      entity.tickers,
    );
    return indicatorBoardMetaData;
  }
}
