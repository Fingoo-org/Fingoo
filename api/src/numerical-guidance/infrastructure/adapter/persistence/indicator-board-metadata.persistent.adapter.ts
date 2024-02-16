import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateIndicatorBoardMetadataPort } from '../../../application/port/persistence/create-indicator-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

import { IndicatorBoardMetadataEntity } from './entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadataMapper } from './mapper/indicator-board-metadata.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { AuthService } from '../../../../auth/auth.service';
import { LoadIndicatorBoardMetadataPort } from 'src/numerical-guidance/application/port/persistence/load-indiactor-board-metadata.port';
import { InsertIndicatorTickerPort } from '../../../application/port/persistence/insert-indicator-ticker.port';
import { TypeORMError } from 'typeorm/error/TypeORMError';

@Injectable()
export class IndicatorBoardMetadataPersistentAdapter
  implements CreateIndicatorBoardMetadataPort, LoadIndicatorBoardMetadataPort, InsertIndicatorTickerPort
{
  constructor(
    @InjectRepository(IndicatorBoardMetadataEntity)
    private readonly indicatorBoardMetadataRepository: Repository<IndicatorBoardMetadataEntity>,
    private readonly authService: AuthService,
  ) {}

  async createIndicatorBoardMetaData(
    indicatorBoardMetaData: IndicatorBoardMetadata,
    memberId: number,
  ): Promise<string> {
    try {
      const member = await this.authService.findById(memberId);

      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity = IndicatorBoardMetadataMapper.mapDomainToEntity(
        indicatorBoardMetaData,
        member,
      );
      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
      return indicatorBoardMetaDataEntity.id;
    } catch (error) {
      if (error instanceof QueryFailedError || EntityNotFoundError) {
        throw new NotFoundException({
          message: '[ERROR] 해당 회원을 찾을 수 없습니다.',
          error: error,
        });
      } else {
        throw new BadRequestException({
          message: '[ERROR] 지표보드 메타데이터를 생성하는 도중에 오류가 발생했습니다.',
          error: error,
        });
      }
    }
  }

  async loadIndicatorBoardMetaData(id: string): Promise<IndicatorBoardMetadata> {
    try {
      const indicatorMetaDataEntity = await this.indicatorBoardMetadataRepository.findOneBy({ id });
      return await IndicatorBoardMetadataMapper.mapEntityToDomain(indicatorMetaDataEntity);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NotFoundException({
          message: '[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.',
          error: error,
        });
      } else {
        throw new BadRequestException({
          message: '[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.',
          error: error,
        });
      }
    }
  }

  async addIndicatorTicker(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void> {
    try {
      const id = indicatorBoardMetaData.id;

      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id });

      indicatorBoardMetaDataEntity.tickers = indicatorBoardMetaData.tickers;

      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new NotFoundException({
          message: '[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.',
          error: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new InternalServerErrorException({
          message: '[ERROR] 지표보드 메타데이터를 업데이트하는 도중에 오류가 발생했습니다.',
          error: error,
        });
      } else {
        throw new BadRequestException({
          message: '[ERROR] indicator를 추가하는 중에 문제가 발생했습니다.',
          error: error,
        });
      }
    }
  }
}
