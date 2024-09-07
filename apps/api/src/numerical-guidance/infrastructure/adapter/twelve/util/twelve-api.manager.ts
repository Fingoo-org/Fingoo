import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IndicatorType, Interval } from '../../../../../utils/type/type-definition';
import * as process from 'process';

const BASE_URL = 'https://api.twelvedata.com';

@Injectable()
export class TwelveApiManager {
  constructor(private readonly api: HttpService) {}

  async getReferenceData(type: IndicatorType, country: string) {
    // TODO: 베타 이후 삭제 예정
    let requestUrl: string;
    if (type == 'funds') {
      requestUrl = `${BASE_URL}/${type}?country=${country}&exchange=NASDAQ`;
      const response = await this.api.axiosRef.get(requestUrl);
      return response.data;
    }
    requestUrl = `${BASE_URL}/${type}?country=${country}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data;
  }

  async searchSymbol(symbol: string) {
    const requestUrl: string = `${BASE_URL}/symbol_search/?symbol=${symbol}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data.data;
  }

  async getTimeSeries(symbol: string, interval: Interval, startDate: string, endDate: string) {
    try {
      const twelveInterval = this.convertIntervalToTwelveInterval(interval);
      const requestUrl: string = `${BASE_URL}/time_series/?symbol=${symbol}&interval=${twelveInterval}&start_date=${startDate}&end_date=${endDate}&apikey=${process.env.TWELVE_KEY}`;
      const response = await this.api.axiosRef.get(requestUrl);
      return this.checkTwelveException(response.data);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          HttpStatus: HttpStatus.NOT_FOUND,
          error: `[ERROR] Twelve API response 값을 찾을 수 없습니다. (해당 지표는 현재 plan에서 사용할 수 없습니다.)`,
          message: '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
          cause: error,
        });
      }
    }
  }

  private convertIntervalToTwelveInterval(interval: Interval): string {
    if (interval == 'month' || interval == 'year') {
      return '1month';
    }
    if (interval == 'day') {
      return '1day';
    }
    if (interval == 'week') {
      return '1week';
    }
    if (interval == 'min') {
      return '5min';
    }
  }
  private checkTwelveException(responseData: any): { values: any[]; meta: any } {
    if (responseData.code == 400) {
      const result: { meta: any; values: [] } = { values: [], meta: {} };
      return result;
    }
    if (responseData.code == 404) {
      throw new NotFoundException();
    }
    return responseData;
  }
}
