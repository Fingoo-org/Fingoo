import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetIndicatorBoardMetadataQuery } from './get-indicator-board-metadata.query';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { IndicatorBoardMetadataMapper } from '../../../../infrastructure/adapter/persistence/indicator-board-metadata/mapper/indicator-board-metadata.mapper';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { InjectRepository } from '@nestjs/typeorm';
import { IndicatorBoardMetadataEntity } from '../../../../infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { Repository } from 'typeorm';

@Injectable()
@QueryHandler(GetIndicatorBoardMetadataQuery)
export class GetIndicatorBoardMetadataQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(IndicatorBoardMetadataEntity)
    private readonly indicatorBoardMetadataRepository: Repository<IndicatorBoardMetadataEntity>,
  ) {}

  async execute(query: GetIndicatorBoardMetadataQuery): Promise<IndicatorBoardMetadata> {
    try {
      const indicatorBoardMetadataEntity = await this.indicatorBoardMetadataRepository.findOneBy({ id: query.id });
      this.nullCheckForEntity(indicatorBoardMetadataEntity);
      return IndicatorBoardMetadataMapper.mapEntityToDomain(indicatorBoardMetadataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${query.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}
