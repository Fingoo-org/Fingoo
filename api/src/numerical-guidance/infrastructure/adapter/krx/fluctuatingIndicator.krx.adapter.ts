import { HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  FluctuatingIndicatorDto,
  IndicatorValue,
} from 'src/numerical-guidance/application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { LoadFluctuatingIndicatorPort } from 'src/numerical-guidance/application/port/external/load-fluctuatingIndicator.port';
import { Interval, Market } from 'src/utils/type/type-definition';
import { LoadLiveIndicatorPort } from '../../../application/port/external/load-live-indicator.port';
import { IndicatorValueManager } from '../../../util/indicator-value-manager';

export const DAY_NUMBER_OF_DAYS = 35;
export const WEEK_NUMBER_OF_DAYS = 240;
export const MONTH_NUMBER_OF_DAYS = 1000;
export const YEAR_NUMBER_OF_DAYS = 10000;

@Injectable()
export class FluctuatingIndicatorKrxAdapter implements LoadFluctuatingIndicatorPort, LoadLiveIndicatorPort {
  constructor(
    private readonly api: HttpService,
    @Inject('IndicatorValueManager')
    private readonly indicatorValueManager: IndicatorValueManager<IndicatorValue>,
  ) {}

  async loadFluctuatingIndicator(
    dataCount: number,
    ticker: string,
    interval: Interval,
    market: Market,
    endDate: string,
  ): Promise<FluctuatingIndicatorDto> {
    const startDate = this.getStartDate(endDate, dataCount);
    const responseData = await this.createKRXResponseData(dataCount, ticker, market, startDate, endDate);

    responseData.values = await this.indicatorValueManager.adjustValuesByInterval(responseData.values, interval);
    return responseData;
  }

  async loadLiveIndicator(ticker: string, interval: Interval, market: Market): Promise<FluctuatingIndicatorDto> {
    const endDate = this.indicatorValueManager.formatDateToString(new Date());
    let startDate: string;
    let responseData: FluctuatingIndicatorDto;
    switch (interval) {
      case 'day':
        startDate = this.getStartDate(endDate, DAY_NUMBER_OF_DAYS);
        responseData = await this.createKRXResponseData(DAY_NUMBER_OF_DAYS, ticker, market, startDate, endDate);
        break;
      case 'week':
        startDate = this.getStartDate(endDate, WEEK_NUMBER_OF_DAYS);
        responseData = await this.createKRXResponseData(WEEK_NUMBER_OF_DAYS, ticker, market, startDate, endDate);
        break;
      case 'month':
        startDate = this.getStartDate(endDate, MONTH_NUMBER_OF_DAYS);
        responseData = await this.createKRXResponseData(MONTH_NUMBER_OF_DAYS, ticker, market, startDate, endDate);
        break;
      case 'year':
        startDate = this.getStartDate(endDate, YEAR_NUMBER_OF_DAYS);
        responseData = await this.createKRXResponseData(YEAR_NUMBER_OF_DAYS, ticker, market, startDate, endDate);
        break;
    }

    responseData.values = await this.indicatorValueManager.adjustValuesByInterval(responseData.values, interval);
    return responseData;
  }

  async createKRXResponseData(
    dataCount: number,
    ticker: string,
    market: Market,
    startDate: string,
    endDate: string,
  ): Promise<FluctuatingIndicatorDto> {
    try {
      const serviceKey: string = process.env.SERVICE_KEY;
      const request_url: string = `http://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${serviceKey}&numOfRows=${dataCount}&pageNo=1&resultType=json&beginBasDt=${startDate}&endBasDt=${endDate}&likeSrtnCd=${ticker}&mrktCls=${market.toUpperCase()}`;

      const res = await this.api.axiosRef.get(request_url);
      const totalCount = res.data.response.body.totalCount;
      const rawValues = res.data.response.body.items.item;

      const values = [];
      for (let i = 0; i < rawValues.length; i++) {
        const { basDt, clpr } = rawValues[i];

        values.push({
          date: basDt,
          value: clpr,
        });
      }

      const type = 'k-stock';
      const responseData = FluctuatingIndicatorDto.create({
        type,
        ticker,
        name: rawValues.itmsNm,
        market,
        totalCount,
        values,
      });

      this.checkResponseData(responseData);

      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        throw new NotFoundException({
          message: '[ERROR] API response body 값을 찾을 수 없습니다.',
          error: error,
          HttpStatus: HttpStatus.NOT_FOUND,
        });
      } else {
        throw new InternalServerErrorException({
          message: `[ERROR] KRX API 요청 과정에서 예상치 못한 오류가 발생했습니다.`,
          error: error,
          HttpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      }
    }
  }

  private checkResponseData(responseData: FluctuatingIndicatorDto) {
    if (!responseData) {
      throw new Error();
    }
  }

  private getStartDate(baseDateString: string, numOfDays: number): string {
    const year = baseDateString.substring(0, 4);
    const month = baseDateString.substring(4, 6);
    const day = baseDateString.substring(6, 8);

    const baseDate = new Date(`${year}-${month}-${day}`);
    const pastDate = new Date(baseDate);
    pastDate.setDate(baseDate.getDate() - numOfDays);

    return this.indicatorValueManager.formatDateToString(pastDate);
  }
}
