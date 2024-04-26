import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IndicatorType, Interval } from '../../../../../utils/type/type-definition';
import * as process from 'process';

const BASE_URL = 'https://api.twelvedata.com';

@Injectable()
export class TwelveApiUtil {
  constructor(private readonly api: HttpService) {}

  async getReferenceData(type: IndicatorType, country: string) {
    const requestUrl: string = `${BASE_URL}/${type}?country=${country}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data;
  }

  async searchSymbol(symbol: string) {
    const requestUrl: string = `${BASE_URL}/symbol_search/?symbol=${symbol}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data.data;
  }

  async getTimeSeries(symbol: string, interval: Interval, startDate: string, endDate: string) {
    const requestUrl: string = `${BASE_URL}/time_series/?symbol=${symbol}&interval=1day&start_date=${startDate}&end_date=${endDate}&apikey=${process.env.TWELVE_KEY}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data;
  }
}
