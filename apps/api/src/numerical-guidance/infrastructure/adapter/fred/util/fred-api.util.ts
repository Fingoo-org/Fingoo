import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

const BASE_URL = 'https://api.stlouisfed.org/fred';

@Injectable()
export class FredApiUtil {
  constructor(private readonly api: HttpService) {}

  async searchIndicator(symbol: string): Promise<undefined[]> {
    const requestUrl: string = `${BASE_URL}/series?series_id=${symbol.toUpperCase()}&api_key=${process.env.FRED_KEY}&file_type=json`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data.seriess;
  }
  //
  // async getSeries(symbol: string) {
  // }
}
