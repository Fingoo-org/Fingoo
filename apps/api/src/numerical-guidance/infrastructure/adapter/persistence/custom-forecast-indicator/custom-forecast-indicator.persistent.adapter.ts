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
import { QueryFailedError, Repository, TypeORMError } from 'typeorm';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorMapper } from './mapper/custom-forecast-indicator.mapper';
import { LoadCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator.port';
import { AuthService } from 'src/auth/application/auth.service';
import { LoadCustomForecastIndicatorsByMemberIdPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicators-by-member-id.port';
import { UpdateSourceIndicatorsInformationPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/update-source-indicators-information.port';
import { HttpService } from '@nestjs/axios';
import { ForecastApiResponse, SourceIndicatorInformation } from 'src/utils/type/type-definition';
import { UpdateCustomForecastIndicatorNamePort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/update-custom-forecast-indicator-name.port';
import { DeleteCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/delete-custom-forecast-indicator.port';
import { LoadCustomForecastIndicatorValuesPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/load-custom-forecast-indicator-values.port';

@Injectable()
export class CustomForecastIndicatorPersistentAdapter
  implements
    CreateCustomForecastIndicatorPort,
    LoadCustomForecastIndicatorPort,
    LoadCustomForecastIndicatorsByMemberIdPort,
    LoadCustomForecastIndicatorValuesPort,
    UpdateSourceIndicatorsInformationPort,
    DeleteCustomForecastIndicatorPort,
    UpdateCustomForecastIndicatorNamePort
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

  async loadCustomForecastIndicatorValues(customForecastIndicatorId: string): Promise<ForecastApiResponse> {
    try {
      const customForecastIndicatorEntity = await this.customForecastIndicatorRepository.findOneBy({
        id: customForecastIndicatorId,
      });
      this.nullCheckForEntity(customForecastIndicatorEntity);

      const customForecastIndicator = CustomForecastIndicatorMapper.mapEntityToDomain(customForecastIndicatorEntity);

      const validIndicators = this.getValidIndicators(customForecastIndicator);
      const validIndicatorIds = validIndicators.map((indicator) => indicator.sourceIndicatorId);

      const url: string =
        process.env.FASTAPI_URL +
        'api/var-api/custom-forecast-indicator?targetIndicatorId=' +
        customForecastIndicator.targetIndicator.id +
        '&targetIndicatorType=' +
        customForecastIndicator.targetIndicator.indicatorType +
        '&';
      let indicatorsUrl: string = '';
      let indicatorsTypeUrl: string = '';
      let weightsUrl: string = '';
      let validIndicatorIdsUrl: string = '';
      for (let i = 0; i < validIndicators.length - 1; i++) {
        indicatorsUrl += `sourceIndicatorId=${validIndicators[i].sourceIndicatorId}&`;
      }
      for (let i = 0; i < validIndicators.length - 1; i++) {
        indicatorsTypeUrl += `sourceIndicatorType=${validIndicators[i].indicatorType}&`;
      }
      for (let i = 0; i < validIndicators.length - 1; i++) {
        weightsUrl += `weight=${validIndicators[i].weight}&`;
      }
      for (let i = 0; i < validIndicatorIds.length; i++) {
        validIndicatorIdsUrl += `validIndicatorId=${validIndicatorIds[i]}&`;
      }

      const requestUrl: string = url + indicatorsUrl + indicatorsTypeUrl + weightsUrl + validIndicatorIdsUrl;

      const res = await this.api.axiosRef.get(requestUrl);
      const resultValues = res.data.values;
      const resultForecastType = res.data.type;
      const result = {
        indicatorValues: resultValues,
        forecastType: resultForecastType,
      };
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] 해당 예측지표를 찾을 수 없습니다.`,
          message: '예측 값을 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      }
      if (error instanceof QueryFailedError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: '[ERROR] 예측 값을 불러오는 중 오류가 발생했습니다. id 형식이 uuid인지 확인해주세요.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 예측 값을 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async loadCustomForecastIndicatorsByMemberId(memberId: string): Promise<CustomForecastIndicator[]> {
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
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 예측지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async createCustomForecastIndicator(
    customForecastIndicator: CustomForecastIndicator,
    memberId: string,
  ): Promise<string> {
    try {
      const member = await this.authService.findById(memberId);
      this.nullCheckForEntity(member);
      const customForecastIndicatorEntity: CustomForecastIndicatorEntity =
        CustomForecastIndicatorMapper.mapDomainToNewEntity(customForecastIndicator, member);

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
          error: '[ERROR] 예측지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async updateSourceIndicatorsInformation(customForecastIndicator: CustomForecastIndicator): Promise<void> {
    try {
      const id = customForecastIndicator.id;
      const customForecastIndicatorEntity: CustomForecastIndicatorEntity =
        await this.customForecastIndicatorRepository.findOneBy({ id });
      this.nullCheckForEntity(customForecastIndicatorEntity);

      customForecastIndicatorEntity.sourceIndicatorsInformation = customForecastIndicator.sourceIndicatorsInformation;
      customForecastIndicatorEntity.sourceIndicators = customForecastIndicator.sourceIndicators;

      if (customForecastIndicatorEntity.sourceIndicatorsInformation.length == 0) {
        const grangerGroup = [];
        const cointJohansenVerification = [];

        customForecastIndicatorEntity.grangerVerification = grangerGroup;
        customForecastIndicatorEntity.cointJohansenVerification = cointJohansenVerification;
      } else {
        const url: string =
          process.env.FASTAPI_URL +
          'api/var-api/source-indicators-verification?targetIndicatorId=' +
          customForecastIndicator.targetIndicator.id +
          '&targetIndicatorType=' +
          customForecastIndicator.targetIndicator.indicatorType +
          '&';
        let indicatorsUrl: string = '';
        let indicatorsTypeUrl: string = '';
        let weightsUrl: string = '';
        for (let i = 0; i < customForecastIndicator.sourceIndicatorsInformation.length; i++) {
          indicatorsUrl += `sourceIndicatorId=${customForecastIndicator.sourceIndicatorsInformation[i].sourceIndicatorId}&`;
        }
        for (let i = 0; i < customForecastIndicator.sourceIndicatorsInformation.length; i++) {
          indicatorsTypeUrl += `sourceIndicatorType=${customForecastIndicator.sourceIndicatorsInformation[i].indicatorType}&`;
        }
        for (let i = 0; i < customForecastIndicator.sourceIndicatorsInformation.length; i++) {
          weightsUrl += `weight=${customForecastIndicator.sourceIndicatorsInformation[i].weight}&`;
        }
        const requestUrl = url + indicatorsUrl + indicatorsTypeUrl + weightsUrl;

        const res = await this.api.axiosRef.get(requestUrl);
        const grangerGroup = res.data.grangerGroup;
        const cointJohansenVerification = res.data.cointJohansenVerification;

        customForecastIndicatorEntity.grangerVerification = grangerGroup;
        customForecastIndicatorEntity.cointJohansenVerification = cointJohansenVerification;
      }
      await this.customForecastIndicatorRepository.save(customForecastIndicatorEntity);
    } catch (error) {
      throw new InternalServerErrorException({
        HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        error: '[ERROR] 예측지표를 업데이트 하는 도중에 예상치 못한 문제가 발생했습니다.',
        message:
          '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요. - 1. 재료지표 id가 올바른지 확인해주세요. 2. 가중치가 올바른 형식을 띄고있는지 확인해주세요.',
        cause: error,
      });
    }
  }

  async updateCustomForecastIndicatorName(customForecastIndicator: CustomForecastIndicator) {
    try {
      const id = customForecastIndicator.id;

      const customForecastIndicatorEntity: CustomForecastIndicatorEntity =
        await this.customForecastIndicatorRepository.findOneBy({ id });
      this.nullCheckForEntity(customForecastIndicatorEntity);

      customForecastIndicatorEntity.customForecastIndicatorName = customForecastIndicator.customForecastIndicatorName;

      await this.customForecastIndicatorRepository.save(customForecastIndicatorEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] customForecastIndicatorId: ${customForecastIndicator.id} 해당 예측지표를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 예측지표의 이름을 수정하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          message: '[ERROR] 예측지표의 이름을 수정하는 중에 예상치 못한 문제가 발생했습니다.',
          cause: error,
        });
      }
    }
  }

  async deleteCustomForecastIndicator(id: string) {
    try {
      const customForecastIndicatorEntity: CustomForecastIndicatorEntity =
        await this.customForecastIndicatorRepository.findOneBy({ id });
      this.nullCheckForEntity(customForecastIndicatorEntity);

      await this.customForecastIndicatorRepository.remove(customForecastIndicatorEntity);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] customForecastIndicatorId: ${id} 해당 예측지표를 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 예측지표를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 예측지표를 삭제하는 도중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }
  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }

  private getValidIndicators(customForecastIndicator: CustomForecastIndicator): SourceIndicatorInformation[] {
    const allIndicatorsInformation = customForecastIndicator.sourceIndicatorsInformation;
    allIndicatorsInformation.push({
      sourceIndicatorId: customForecastIndicator.targetIndicator.id,
      indicatorType: customForecastIndicator.targetIndicator.indicatorType,
      weight: null,
    });
    const validIndicators = allIndicatorsInformation.filter(
      (_SourceIndicatorInformation, index) =>
        customForecastIndicator.grangerVerification[index].verification === 'True',
    );
    return validIndicators;
  }
}
