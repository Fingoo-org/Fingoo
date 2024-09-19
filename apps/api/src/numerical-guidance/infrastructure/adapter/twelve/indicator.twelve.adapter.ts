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
import { MajorChart } from 'src/numerical-guidance/domain/major-chart';
import { format, setHours, setMinutes, setSeconds, startOfDay, subDays } from 'date-fns';
import { plainToInstance } from 'class-transformer';
import ChartTimeline from '../../../api/major-chart/dto/chart-timeline.dto';
import { LoadLiveMajorChartIndicator } from '../../../../numerical-guidance/application/port/external/twelve/load-live-major-chart-indicator.port';

@Injectable()
export class IndicatorTwelveAdapter
  implements SearchTwelveIndicatorPort, LoadLiveIndicatorPort, LoadLiveMajorChartIndicator
{
  private readonly logger = new Logger(IndicatorTwelveAdapter.name);

  constructor(
    private readonly twelveApiUtil: TwelveApiManager,
    @Inject('IndicatorValueManager')
    private readonly indicatorValueManager: IndicatorValueManager<IndicatorValue>,
  ) {}

  async loadMajorChart(symbol: string, interval: Interval): Promise<MajorChart> {
    const todayStartDate = setSeconds(setMinutes(setHours(startOfDay(Date.now()), 9), 0), 0);
    const todayEndDate = setSeconds(setMinutes(setHours(startOfDay(Date.now()), 16), 0), 0);
    const yesterdayStartDate = subDays(todayStartDate, 1);
    const yesterdayEndDate = subDays(todayEndDate, 1);

    try {
      // const todayTimeline = await this.twelveApiUtil.getTimeSeries(
      //   symbol,
      //   interval,
      //   format(todayStartDate, 'yyyy-MM-dd HH:mm:ss'),
      //   format(todayEndDate, 'yyyy-MM-dd HH:mm:ss'),
      // );

      const yesterdayTimelines = await this.twelveApiUtil.getTimeSeries(
        symbol,
        interval,
        format(yesterdayStartDate, 'yyyy-MM-dd HH:mm:ss'),
        format(yesterdayEndDate, 'yyyy-MM-dd HH:mm:ss'),
      );

      // console.log(todayTimeline);
      // console.log(yesterdayTimelines);
      // TODO 오늘 심볼을 아직 읽지 못함 API 를 좀 더 알아봐야한다.
      // 프론트에서 연동 할 수 있도록 어제일자로 우선 구현해둠

      return plainToInstance(MajorChart, {
        currency: yesterdayTimelines.meta['currency'],
        symbolName: symbol,
        symbolPrice: yesterdayTimelines.values[0]['open'],
        symbolChanges: ((yesterdayTimelines.values[0]['open'] as number) -
          yesterdayTimelines.values[0]['open']) as number,
        timeline: yesterdayTimelines.values.map((value) =>
          plainToInstance(ChartTimeline, { time: value['datetime'], value: Number(value['open']) }),
        ),
      });
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new InternalServerErrorException({
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '[ERROR] 지표를 검색하는 중 중에 예상치 못한 문제가 발생했습니다.',
          message: '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

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
