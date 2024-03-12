import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/create-custom-forecast-indicator.port';
import { CustomForecastIndicatorEntity } from './entity/custom-forecast-indicator.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorMapper } from './mapper/custom-forecast-indicator.mapper';
import { LoadCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { AuthService } from 'src/auth/auth.service';
import { LoadCustomForecastIndicatorsByMemberIdPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicators-by-member-id.port';
import { UpdateSourceIndicatorsAndWeightsPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/update-source-indicators-and-weights.port';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CustomForecastIndicatorPersistentAdapter
  implements
    CreateCustomForecastIndicatorPort,
    LoadCustomForecastIndicatorPort,
    LoadCustomForecastIndicatorsByMemberIdPort,
    UpdateSourceIndicatorsAndWeightsPort
{
  constructor(
    @InjectRepository(CustomForecastIndicatorEntity)
    private readonly customForecastIndicatorRepository: Repository<CustomForecastIndicatorEntity>,
    private readonly authService: AuthService,
    private readonly api: HttpService,
  ) {}

  async loadCustomForecastIndicator(customForecastIndicatorId: string): Promise<CustomForecastIndicator> {
    try {
      const customForecastIndicatorEntity = await this.customForecastIndicatorRepository.findOneBy({
        id: customForecastIndicatorId,
      });
      this.nullCheckForEntity(customForecastIndicatorEntity);

      return CustomForecastIndicatorMapper.mapEntityToDomain(customForecastIndicatorEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] 해당 예측지표를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      }
      if (error instanceof QueryFailedError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 예측지표를 불러오는 중 오류가 발생했습니다. id 형식이 uuid인지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 얘측지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async loadCustomForecastIndicatorsByMemberId(memberId: number): Promise<CustomForecastIndicator[]> {
    try {
      const member = await this.authService.findById(memberId);
      this.nullCheckForEntity(member);

      const customForecastIndicatorEntities: CustomForecastIndicatorEntity[] =
        await this.customForecastIndicatorRepository.findBy({ member: member });
      const customForecastIndicators = customForecastIndicatorEntities.map((entity) => {
        return CustomForecastIndicatorMapper.mapEntityToDomain(entity);
      });

      return customForecastIndicators;
    } catch (error) {
      if (error instanceof NotFoundException) {
        console.log(memberId);
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 얘측지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async createCustomForecastIndicator(
    customForecastIndicator: CustomForecastIndicator,
    memberId: number,
  ): Promise<string> {
    try {
      const member = await this.authService.findById(memberId);
      this.nullCheckForEntity(member);

      const customForecastIndicatorEntity: CustomForecastIndicatorEntity =
        CustomForecastIndicatorMapper.mapDomainToEntity(customForecastIndicator, member);

      await this.customForecastIndicatorRepository.save(customForecastIndicatorEntity);
      return customForecastIndicatorEntity.id;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 얘측지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async updateSourceIndicatorsAndWeights(customForecastIndicator: CustomForecastIndicator): Promise<void> {
    try {
      const id = customForecastIndicator.id;

      const requestUrl =
        'http://127.0.0.1:8000/api/var-api/source-indicators-verification?targetIndicatorId=26929514-237c-11ed-861d-0242ac120031&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120011&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120021&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120031&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120041&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120051&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120061&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120071&sourceIndicatorId=26929514-237c-11ed-861d-0242ac120081&weight=0.004/5&weight=0.002/3&weight=none&weight=0.005/2&weight=none&weight=0.003/1&weight=0.004/5&weight=0.007/4';
      const res = await this.api.axiosRef.get(requestUrl);

      console.log(res.data.grangerGroup);
      console.log(res.data.cointJohansenVerification);

      const grangerGroup = res.data.grangerGroup;
      const cointJohansenVerification = res.data.cointJohansenVerification;

      const customForecastIndicatorEntity: CustomForecastIndicatorEntity =
        await this.customForecastIndicatorRepository.findOneBy({ id });
      this.nullCheckForEntity(customForecastIndicatorEntity);

      customForecastIndicatorEntity.sourceIndicatorIdsAndWeights = customForecastIndicator.sourceIndicatorIdsAndWeights;
      customForecastIndicatorEntity.grangerVerification = grangerGroup;
      customForecastIndicatorEntity.cointJohansenVerification = cointJohansenVerification;

      await this.customForecastIndicatorRepository.save(customForecastIndicatorEntity);
    } catch (error) {
      throw error;
    }
  }
  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}
