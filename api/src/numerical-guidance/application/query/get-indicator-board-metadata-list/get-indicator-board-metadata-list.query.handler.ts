import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IndicatorBoardMetadata } from 'src/numerical-guidance/domain/indicator-board-metadata';
import { GetIndicatorBoardMetadataListQuery } from './get-indicator-board-metadata-list.query';
import { IndicatorBoardMetadataEntity } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadataMapper } from '../../../infrastructure/adapter/persistence/indicator-board-metadata/mapper/indicator-board-metadata.mapper';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../../../auth/auth.service';

@Injectable()
@QueryHandler(GetIndicatorBoardMetadataListQuery)
export class GetIndicatorBoardMetadataListQueryHandler implements IQueryHandler {
  constructor(
    @InjectRepository(IndicatorBoardMetadataEntity)
    private readonly indicatorBoardMetadataRepository: Repository<IndicatorBoardMetadataEntity>,
    private readonly authService: AuthService,
  ) {}

  async execute(query: GetIndicatorBoardMetadataListQuery): Promise<IndicatorBoardMetadata[]> {
    try {
      const memberEntity = await this.authService.findById(query.memberId);
      this.nullCheckForEntity(memberEntity);

      const indicatorBoardMetadataEntities: IndicatorBoardMetadataEntity[] =
        await this.indicatorBoardMetadataRepository.findBy({
          member: memberEntity,
        });
      return indicatorBoardMetadataEntities.map((entity) => {
        return IndicatorBoardMetadataMapper.mapEntityToDomain(entity);
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] memberId: ${query.memberId} 해당 회원을 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      }
      if (error instanceof QueryFailedError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 메타데이터 리스트를 불러오는 중 오류가 발생했습니다. member id값이 number인지 확인하세요.',
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
