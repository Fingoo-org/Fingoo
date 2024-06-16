import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TwelveApiManager } from './util/twelve-api.manager';
import {
  IndicatorDtoType,
  IndicatorValue,
  Interval,
  LiveIndicatorDtoType,
} from '../../../../utils/type/type-definition';
import { SearchTwelveIndicatorPort } from '../../../application/port/persistence/indicator/search-twelve-indicator.port';
import {
  SearchedIndicatorsDto,
  SearchedSymbolType,
} from '../../../application/query/indicator/search-twelve-indicator/dto/searched-indicators.dto';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { IndicatorValueManager } from '../../../util/indicator-value-manager';
import { LoadLiveIndicatorPort } from '../../../application/port/external/twelve/load-live-indicator.port';
import { IndicatorTwelveMapper } from './mapper/indicator.twelve.mapper';

@Injectable()
export class IndicatorTwelveAdapter implements SearchTwelveIndicatorPort, LoadLiveIndicatorPort {
  private readonly logger = new Logger(IndicatorTwelveAdapter.name);

  constructor(
    private readonly twelveApiUtil: TwelveApiManager,
    @Inject('IndicatorValueManager')
    private readonly indicatorValueManager: IndicatorValueManager<IndicatorValue>,
  ) {}

  async searchIndicator(symbol: string): Promise<SearchedIndicatorsDto> {
    try {
      const initData: SearchedSymbolType[] = await this.twelveApiUtil.searchSymbol(symbol);
      const initSymbols: SearchedSymbolType[] = initData.map((data) => data);
      return SearchedIndicatorsDto.create(initSymbols);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 검색할 symbol 요청이 올바른지 확인해주세요.`,
          message: '검색할 symbol 요청이 올바른지 확인해주세요.',
          cause: error,
        });
      } else if (error instanceof TypeORMError || NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] symbol: ${symbol} 해당 symbol을 찾을 수 없습니다.`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표를 검색하는 중 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  async loadLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: Interval,
    rowStartDate: string,
    rowEndDate: string,
  ): Promise<LiveIndicatorDtoType> {
    const responseData = await this.twelveApiUtil.getTimeSeries(
      indicatorDto.symbol,
      interval,
      rowStartDate,
      rowEndDate,
    );

    const values: IndicatorValue[] = this.convertRowDataToIndicatorValue(responseData);
    return await this.generateIndicatorDto(interval, indicatorDto, responseData, values);
  }

  private convertRowDataToIndicatorValue(responseData): IndicatorValue[] {
    return responseData.values.map((value) => {
      return { date: value.datetime, value: value.close };
    });
  }

  private async generateIndicatorDto(interval: Interval, indicatorDto, responseData, values) {
    if (interval == 'year') {
      const valuesPerOneYear = await this.indicatorValueManager.convertIndicatorValueMonthToYear(values);
      return IndicatorTwelveMapper.mapToIndicatorDtoByType(indicatorDto, valuesPerOneYear, responseData);
    }
    return IndicatorTwelveMapper.mapToIndicatorDtoByType(indicatorDto, values, responseData);
  }
}
