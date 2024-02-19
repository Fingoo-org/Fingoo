import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateIndicatorBoardMetadataPort } from '../../../application/port/persistence/create-indicator-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../domain/indicator-board-metadata';

import { IndicatorBoardMetadataEntity } from './entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadataMapper } from './mapper/indicator-board-metadata.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AuthService } from '../../../../auth/auth.service';
import { LoadIndicatorBoardMetadataPort } from 'src/numerical-guidance/application/port/persistence/load-indiactor-board-metadata.port';
import { InsertIndicatorTickerPort } from '../../../application/port/persistence/insert-indicator-ticker.port';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { LoadUserIndicatorBoardMetadataListPort } from 'src/numerical-guidance/application/port/persistence/load-user-indicator-board-metadata-list.port';

@Injectable()
export class IndicatorBoardMetadataPersistentAdapter
  implements
    CreateIndicatorBoardMetadataPort,
    LoadIndicatorBoardMetadataPort,
    InsertIndicatorTickerPort,
    LoadUserIndicatorBoardMetadataListPort
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
      this.nullCheckForEntity(member);

      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity = IndicatorBoardMetadataMapper.mapDomainToEntity(
        indicatorBoardMetaData,
        member,
      );
      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
      return indicatorBoardMetaDataEntity.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          message: '[ERROR] 해당 회원을 찾을 수 없습니다.',
          error: error,
        });
      } else {
        throw new InternalServerErrorException({
          message: `[ERROR] 지표보드 메타데이터를 생성하는 도중에 오류가 발생했습니다. 다음과 같은 상황을 확인해보세요.
          1. indicatorBoardMetaData 값 중 비어있는 값이 있는가
          `,
          error: error,
        });
      }
    }
  }

  async loadIndicatorBoardMetaData(id: string): Promise<IndicatorBoardMetadata> {
    try {
      const indicatorBoardMetaDataEntity = await this.indicatorBoardMetadataRepository.findOneBy({ id });
      this.nullCheckForEntity(indicatorBoardMetaDataEntity);
      return await IndicatorBoardMetadataMapper.mapEntityToDomain(indicatorBoardMetaDataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          message: '[ERROR] 해당 지표보드 메타데이터를 찾을 수 없습니다.',
          error: error,
        });
      } else if (error instanceof QueryFailedError) {
        throw new BadRequestException({
          message: `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다. 다음을 확인해보세요.
          1. id 값이 uuid 형식을 잘 따르고 있는가
          `,
          error: error,
        });
      } else {
        throw new InternalServerErrorException({
          message: '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          error: error,
        });
      }
    }
  }

  async loadUserIndicatorBoardMetadataList(memberId: number): Promise<IndicatorBoardMetadata[]> {
    try {
      const userIndicatorBoardMetadataList = [];
      const memberEntity = await this.authService.findById(memberId);

      const query = this.indicatorBoardMetadataRepository.createQueryBuilder('IndicatorBoardMetadataEntity');
      query.where('IndicatorBoardMetadataEntity.memberId = :memberId', { memberId: memberEntity.id });

      const userIndicatorBoardMetadataEntityList = await query.getMany();

      for (let i = 0; i < userIndicatorBoardMetadataEntityList.length; i++) {
        const userIndicatorBoardMetadata = await IndicatorBoardMetadataMapper.mapEntityToDomain(
          userIndicatorBoardMetadataEntityList[i],
        );
        userIndicatorBoardMetadataList.push(userIndicatorBoardMetadata);
      }

      return userIndicatorBoardMetadataList;
    } catch (error) {}
  }

  async addIndicatorTicker(indicatorBoardMetaData: IndicatorBoardMetadata): Promise<void> {
    try {
      const id = indicatorBoardMetaData.id;

      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id });
      this.nullCheckForEntity(indicatorBoardMetaDataEntity);

      indicatorBoardMetaDataEntity.tickers = indicatorBoardMetaData.tickers;

      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
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
        throw new InternalServerErrorException({
          message: '[ERROR] 새로운 지표를 추가하는 중에 예상치 못한 문제가 발생했습니다.',
          error: error,
        });
      }
    }
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}
