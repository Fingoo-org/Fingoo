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

@Injectable()
export class CustomForecastIndicatorPersistentAdapter
  implements
    CreateCustomForecastIndicatorPort,
    LoadCustomForecastIndicatorPort,
    LoadCustomForecastIndicatorsByMemberIdPort
{
  constructor(
    @InjectRepository(CustomForecastIndicatorEntity)
    private readonly customForecastIndicatorRepository: Repository<CustomForecastIndicatorEntity>,
    private readonly authService: AuthService,
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
          message: `[ERROR] 해당 예측지표를 찾을 수 없습니다.`,
          error: error,
        });
      }
      if (error instanceof QueryFailedError) {
        throw new BadRequestException({
          message: '[ERROR] 예측지표를 불러오는 중 오류가 발생했습니다. id 형식이 uuid인지 확인해주세요.',
          error: error,
        });
      } else {
        throw new InternalServerErrorException({
          message: '[ERROR] 얘측지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
          error: error,
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
    } catch (error) {}
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
          message: error,
          error: `[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.`,
          HttpStatus: HttpStatus.NOT_FOUND,
        });
      } else {
        throw new InternalServerErrorException({
          message: `[ERROR] 예측지표를 생성하는 중 예상치 못한 문제가 발생했습니다.`,
          error: error,
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  private nullCheckForEntity(entity) {
    if (entity == null) throw new NotFoundException();
  }
}
