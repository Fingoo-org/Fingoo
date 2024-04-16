import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { IndicatorType } from '../../../../../utils/type/type-definition';

const BASE_URL = 'https://api.twelvedata.com';

@Injectable()
export class TwelveApiUtil {
  constructor(private readonly api: HttpService) {}

  async getReferenceData(type: IndicatorType) {
    const requestUrl: string = `${BASE_URL}/${type}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data;
  }

  async searchSymbol(symbol: string) {
    const requestUrl: string = `${BASE_URL}/symbol_search/?symbol=${symbol}`;
    const response = await this.api.axiosRef.get(requestUrl);
    return response.data.data;
  }
}
