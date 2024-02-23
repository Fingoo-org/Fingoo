import { IndicatorBoardMetadataEntity } from '../entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadata } from '../../../../../domain/indicator-board-metadata';
import { MemberEntity } from '../../../../../../auth/member.entity';

export class IndicatorBoardMetadataMapper {
  static mapDomainToEntity(indicatorBoardMetaData: IndicatorBoardMetadata, member: MemberEntity) {
    const indicatorBoardMetadataEntity: IndicatorBoardMetadataEntity = new IndicatorBoardMetadataEntity();
    indicatorBoardMetadataEntity.indicatorBoardMetadataName = indicatorBoardMetaData.indicatorBoardMetadataName;
    indicatorBoardMetadataEntity.tickers = indicatorBoardMetaData.tickers;
    indicatorBoardMetadataEntity.member = member;
    indicatorBoardMetadataEntity.createdAt = indicatorBoardMetaData.createdAt;
    indicatorBoardMetadataEntity.updatedAt = indicatorBoardMetaData.updatedAt;
    return indicatorBoardMetadataEntity;
  }

  static mapEntityToDomain(entity: IndicatorBoardMetadataEntity) {
    const indicatorBoardMetadata = new IndicatorBoardMetadata(
      entity.id,
      entity.indicatorBoardMetadataName,
      entity.tickers,
    );
    return indicatorBoardMetadata;
  }
}
