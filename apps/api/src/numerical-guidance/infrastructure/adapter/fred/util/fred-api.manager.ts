import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Interval } from '../../../../../utils/type/type-definition';

const BASE_URL = 'https://api.stlouisfed.org/fred';

@Injectable()
export class FredApiManager {
  constructor(private readonly api: HttpService) {}

  async searchIndicator(symbol: string): Promise<undefined[]> {
    const requestUrl: string = `${BASE_URL}/series?series_id=${symbol.toUpperCase()}&api_key=${process.env.FRED_KEY}&file_type=json`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data.seriess;
  }

  async getSeries(symbol: string, interval: Interval, startDate: string, endDate: string) {
    const requestUrl: string = `${BASE_URL}/series/observations?series_id=${symbol.toUpperCase()}&api_key=${process.env.FRED_KEY}&file_type=json&observation_start=${startDate}&observation_end=${endDate}&frequency${this.convertInterval(interval)}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data.observations;
  }

  private convertInterval(interval: Interval): string {
    switch (interval) {
      case 'day':
        return 'd';
      case 'week':
        return 'w';
      case 'month':
        return 'm';
      case 'year':
        return 'a';
    }
  }
}
