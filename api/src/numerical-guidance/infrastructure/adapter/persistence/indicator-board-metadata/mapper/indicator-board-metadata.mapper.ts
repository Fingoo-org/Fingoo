import { IndicatorBoardMetadataEntity } from '../entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadata } from '../../../../../domain/indicator-board-metadata';
import { MemberEntity } from '../../../../../../auth/member.entity';
import { IndicatorBoardMetadataDto } from '../../../../../application/query/get-indicator-board-metadata/indicator-board-metadata.dto';

export class IndicatorBoardMetadataMapper {
  static mapDomainToEntity(
    indicatorBoardMetaData: IndicatorBoardMetadata,
    member: MemberEntity,
  ): IndicatorBoardMetadataEntity {
    const indicatorBoardMetadataEntity: IndicatorBoardMetadataEntity = new IndicatorBoardMetadataEntity();
    indicatorBoardMetadataEntity.indicatorBoardMetadataName = indicatorBoardMetaData.indicatorBoardMetadataName;
    indicatorBoardMetadataEntity.indicatorIds = { indicatorIds: indicatorBoardMetaData.indicatorIds };
    indicatorBoardMetadataEntity.member = member;
    indicatorBoardMetadataEntity.createdAt = indicatorBoardMetaData.createdAt;
    indicatorBoardMetadataEntity.updatedAt = indicatorBoardMetaData.updatedAt;
    return indicatorBoardMetadataEntity;
  }

  static mapEntityToDomain(entity: IndicatorBoardMetadataEntity): IndicatorBoardMetadata {
    return new IndicatorBoardMetadata(
      entity.id,
      entity.indicatorBoardMetadataName,
      entity.indicatorIds['indicatorIds'].toString().split(','),
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static mapDtoToDomain(dto: IndicatorBoardMetadataDto): IndicatorBoardMetadata {
    return new IndicatorBoardMetadata(
      dto.id,
      dto.indicatorBoardMetadataName,
      dto.indicatorIds,
      dto.createdAt,
      dto.updatedAt,
    );
  }

  static mapDomainToDto(domain: IndicatorBoardMetadata): IndicatorBoardMetadataDto {
    return IndicatorBoardMetadataDto.create({
      id: domain.id,
      indicatorBoardMetadataName: domain.indicatorBoardMetadataName,
      indicatorIds: domain.indicatorIds,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    });
  }
}
