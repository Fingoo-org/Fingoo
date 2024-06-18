import { BadRequestException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { LoadLiveEconomyIndicatorPort } from '../../../application/port/external/fred/load-live-economy-indicator.port';
import { FredApiManager } from './util/fred-api.manager';
import {
  IndicatorDtoType,
  IndicatorValue,
  Interval,
  LiveIndicatorDtoType,
} from '../../../../utils/type/type-definition';
import { IndicatorFredMapper } from './mapper/indicator.fred.mapper';

@Injectable()
export class IndicatorFredAdapter implements LoadLiveEconomyIndicatorPort {
  private readonly logger = new Logger(IndicatorFredAdapter.name);

  constructor(private readonly fredApiUtil: FredApiManager) {}

  async loadLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: Interval,
    rowStartDate: string,
    rowEndDate: string,
  ): Promise<LiveIndicatorDtoType> {
    try {
      const responseData = await this.fredApiUtil.getSeries(indicatorDto.symbol, interval, rowStartDate, rowEndDate);
      const values: IndicatorValue[] = this.convertRowDataToIndicatorValue(responseData);
      return IndicatorFredMapper.mapToIndicatorDto(indicatorDto, values);
    } catch (error) {
      throw new BadRequestException({
        HttpStatus: HttpStatus.BAD_REQUEST,
        error: `[ERROR] Fred API response 값을 찾을 수 없습니다. startDate 값이 올바른지 확인해주세요`,
        message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
        cause: error,
      });
    }
  }

  private convertRowDataToIndicatorValue(responseData): IndicatorValue[] {
    return responseData.map((value) => {
      return { date: value.date, value: value.value };
    });
  }
}
