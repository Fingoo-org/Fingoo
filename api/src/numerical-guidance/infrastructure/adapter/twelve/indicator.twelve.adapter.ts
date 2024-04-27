import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TwelveApiUtil } from './util/twelve-api.util';
import {
  IndicatorDtoType,
  IndicatorValue,
  Interval,
  LiveIndicatorDtoType,
} from '../../../../utils/type/type-definition';
import { SearchIndicatorPort } from '../../../application/port/persistence/indicator/search-indicator.port';
import {
  SearchedIndicatorsDto,
  SearchedSymbolType,
} from '../../../application/query/indicator/get-indicator-search/dto/searched-indicators.dto';
import { TypeORMError } from 'typeorm/error/TypeORMError';
import { IndicatorValueManager } from '../../../util/indicator-value-manager';
import { LoadLiveIndicatorPort } from '../../../application/port/external/twelve/load-live-indicator.port';
import { IndicatorTwelveMapper } from './mapper/indicator.twelve.mapper';

@Injectable()
export class IndicatorTwelveAdapter implements SearchIndicatorPort, LoadLiveIndicatorPort {
  private readonly logger = new Logger(IndicatorTwelveAdapter.name);

  constructor(
    private readonly twelveApiUtil: TwelveApiUtil,
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
    try {
      const responseData = await this.twelveApiUtil.getTimeSeries(
        indicatorDto.symbol,
        interval,
        rowStartDate,
        rowEndDate,
      );
      if (responseData.code === 404) this.logger.error({ message: responseData.message });
      const values: any[] = responseData.values.map((value) => {
        return { date: value.datetime, value: value.close };
      });

      const adjustedValuesByInterval = await this.indicatorValueManager.adjustValuesByInterval(values, interval);

      return IndicatorTwelveMapper.mapToIndicatorDtoByType(indicatorDto, adjustedValuesByInterval, responseData);
    } catch (error) {
      if (error instanceof TypeError) {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: `[ERROR] Twelve API response 값을 찾을 수 없습니다. (해당 지표는 현재 plan에서 사용할 수 없습니다.)`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof Error) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: '[ERROR] API response body 값을 찾을 수 없습니다.',
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException({
          HttpStatus: HttpStatus.BAD_REQUEST,
          error: `[ERROR] 잘못된 요청값입니다. indicatorId, interval이 올바른지 확인해주세요.`,
          message: '입력값이 올바른지 확인해주세요. 지표는 day, week, month, year 별로 확인 가능합니다.',
          cause: error,
        });
      }
    }
  }
}
