import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCustomForecastIndicatorPort } from 'src/numerical-guidance/application/port/persistence/custom-forecast-indicator/create-custom-forecast-indicator.port';
import { CustomForecastIndicatorEntity } from './entity/custom-forecast-indicator.entity';
import { Repository } from 'typeorm';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';
import { CustomForecastIndicatorMapper } from './mapper/custom-forecast-indicator.mapper';

@Injectable()
export class CustomForecastIndicatorPersistentAdapter implements CreateCustomForecastIndicatorPort {
  constructor(
    @InjectRepository(CustomForecastIndicatorEntity)
    private readonly customForecastIndicatorRepository: Repository<CustomForecastIndicatorEntity>,
  ) {}
  async createCustomForecastIndicator(customForecastIndicator: CustomForecastIndicator): Promise<string> {
    try {
      const customForecastIndicatorEntity: CustomForecastIndicatorEntity =
        CustomForecastIndicatorMapper.mapDomainToEntity(customForecastIndicator);
      await this.customForecastIndicatorRepository.save(customForecastIndicatorEntity);
      return customForecastIndicatorEntity.id;
    } catch (error) {
      throw new InternalServerErrorException({
        message: `[ERROR] 지표보드 메타데이터를 생성하는 도중에 오류가 발생했습니다. 다음과 같은 상황을 확인해보세요.
        1. indicatorBoardMetaData 값 중 비어있는 값이 있는지 확인해주세요.`,
        error: error,
        HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
