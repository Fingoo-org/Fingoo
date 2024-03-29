import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateIndicatorBoardMetadataPort } from '../../../../application/port/persistence/indicator-board-metadata/create-indicator-board-metadata.port';
import { IndicatorBoardMetadata } from '../../../../domain/indicator-board-metadata';

import { IndicatorBoardMetadataEntity } from './entity/indicator-board-metadata.entity';
import { IndicatorBoardMetadataMapper } from './mapper/indicator-board-metadata.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { AuthService } from '../../../../../auth/auth.service';
import { LoadIndicatorBoardMetadataPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/load-indiactor-board-metadata.port';
import { InsertIndicatorIdPort } from '../../../../application/port/persistence/indicator-board-metadata/insert-indicator-id.port';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { LoadIndicatorBoardMetadataListPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/load-indicator-board-metadata-list.port';
import { DeleteIndicatorIdPort } from '../../../../application/port/persistence/indicator-board-metadata/delete-indicator-id.port';
import { DeleteIndicatorBoardMetadataPort } from '../../../../application/port/persistence/indicator-board-metadata/delete-indicator-board-metadata.port';

import { UpdateIndicatorBoardMetadataNamePort } from '../../../../application/port/persistence/indicator-board-metadata/update-indicator-board-metadata-name.port';
import { InsertCustomForecastIndicatorIdPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/insert-custom-forecast-indicator-id.port';
import { DeleteCustomForecastIndicatorIdPort } from 'src/numerical-guidance/application/port/persistence/indicator-board-metadata/delete-custom-forecast-indicator-id.port';

@Injectable()
export class IndicatorBoardMetadataPersistentAdapter
  implements
    CreateIndicatorBoardMetadataPort,
    LoadIndicatorBoardMetadataPort,
    InsertIndicatorIdPort,
    LoadIndicatorBoardMetadataListPort,
    DeleteIndicatorIdPort,
    DeleteIndicatorBoardMetadataPort,
    UpdateIndicatorBoardMetadataNamePort,
    InsertCustomForecastIndicatorIdPort,
    DeleteCustomForecastIndicatorIdPort
{
  constructor(
    @InjectRepository(IndicatorBoardMetadataEntity)
    private readonly indicatorBoardMetadataRepository: Repository<IndicatorBoardMetadataEntity>,
    private readonly authService: AuthService,
  ) {}

  async createIndicatorBoardMetadata(
    indicatorBoardMetadata: IndicatorBoardMetadata,
    memberId: number,
  ): Promise<string> {
    try {
      const member = await this.authService.findById(memberId);
      this.nullCheckForEntity(member);

      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity = IndicatorBoardMetadataMapper.mapDomainToEntity(
        indicatorBoardMetadata,
        member,
      );
      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
      return indicatorBoardMetaDataEntity.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.`,
          message: '회원 정보가 올바른지 확인해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `[ERROR] 지표보드 메타데이터를 생성하는 도중에 오류가 발생했습니다. 다음과 같은 상황을 확인해보세요.
          1. indicatorBoardMetaData 값 중 비어있는 값이 있는지 확인해주세요.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async loadIndicatorBoardMetadata(id: string): Promise<IndicatorBoardMetadata> {
    try {
      const indicatorBoardMetadataEntity = await this.indicatorBoardMetadataRepository.findOneBy({ id: id });
      this.nullCheckForEntity(indicatorBoardMetadataEntity);
      return IndicatorBoardMetadataMapper.mapEntityToDomain(indicatorBoardMetadataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
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

  async loadIndicatorBoardMetadataList(memberId): Promise<IndicatorBoardMetadata[]> {
    try {
      const memberEntity = await this.authService.findById(memberId);
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
          error: `[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.`,
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

  async addIndicatorId(indicatorBoardMetadata: IndicatorBoardMetadata): Promise<void> {
    try {
      const id = indicatorBoardMetadata.id;

      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id });
      this.nullCheckForEntity(indicatorBoardMetaDataEntity);

      indicatorBoardMetaDataEntity.indicatorIds = { indicatorIds: indicatorBoardMetadata.indicatorIds };
      indicatorBoardMetaDataEntity.sections = indicatorBoardMetadata.sections;

      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetadata.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 지표보드 메타데이터를 업데이트하는 도중에 entity 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 새로운 지표를 추가하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async addCustomForecastIndicatorId(indicatorBoardMetadata: IndicatorBoardMetadata): Promise<void> {
    try {
      const id = indicatorBoardMetadata.id;

      const indicatorBoardMetadataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id });
      this.nullCheckForEntity(indicatorBoardMetadataEntity);

      indicatorBoardMetadataEntity.customForecastIndicatorIds = {
        customForecastIndicatorIds: indicatorBoardMetadata.customForecastIndicatorIds,
      };
      indicatorBoardMetadataEntity.sections = indicatorBoardMetadata.sections;

      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetadataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetadata.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 지표보드 메타데이터를 업데이트하는 도중에 entity 오류가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 새로운 예측 지표를 추가하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async deleteCustomForecastIndicatorId(indicatorBoardMetadata: IndicatorBoardMetadata): Promise<void> {
    try {
      const id = indicatorBoardMetadata.id;

      const indicatorBoardMetadataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id });
      this.nullCheckForEntity(indicatorBoardMetadataEntity);

      indicatorBoardMetadataEntity.customForecastIndicatorIds = {
        customForecastIndicatorIds: indicatorBoardMetadata.customForecastIndicatorIds,
      };
      indicatorBoardMetadataEntity.sections = indicatorBoardMetadata.sections;

      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetadataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetadata.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 지표보드 메타데이터 예측지표 id를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 예측지표 id를 삭제하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async deleteIndicatorId(indicatorBoardMetadata: IndicatorBoardMetadata): Promise<void> {
    try {
      const id = indicatorBoardMetadata.id;

      const indicatorBoardMetadataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id });
      this.nullCheckForEntity(indicatorBoardMetadataEntity);

      indicatorBoardMetadataEntity.indicatorIds = { indicatorIds: indicatorBoardMetadata.indicatorIds };
      indicatorBoardMetadataEntity.sections = indicatorBoardMetadata.sections;

      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetadataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetadata.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 지표보드 메타데이터 지표 id를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표 id를 삭제하는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async deleteIndicatorBoardMetadata(id: string) {
    try {
      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id: id });
      this.nullCheckForEntity(indicatorBoardMetaDataEntity);

      await this.indicatorBoardMetadataRepository.remove(indicatorBoardMetaDataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 지표보드 메타데이터를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표보드 메타데이터를 삭제하는 도중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async updateIndicatorBoardMetadataName(indicatorBoardMetadata: IndicatorBoardMetadata): Promise<void> {
    try {
      const id = indicatorBoardMetadata.id;

      const indicatorBoardMetaDataEntity: IndicatorBoardMetadataEntity =
        await this.indicatorBoardMetadataRepository.findOneBy({ id });
      this.nullCheckForEntity(indicatorBoardMetaDataEntity);

      indicatorBoardMetaDataEntity.indicatorBoardMetadataName = indicatorBoardMetadata.indicatorBoardMetadataName;

      await this.indicatorBoardMetadataRepository.save(indicatorBoardMetaDataEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetadata.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 지표보드 메타데이터의 이름을 수정하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          message: '[ERROR] 지표보드 메타데이터의 이름을 수정하는 중에 예상치 못한 문제가 발생했습니다.',
          cause: error,
        });
      }
    }
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}
