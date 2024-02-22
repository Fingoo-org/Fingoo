import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { FluctuatingIndicatorDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { LoadFluctuatingIndicatorPort } from 'src/numerical-guidance/application/port/external/load-fluctuatingIndicator.port';
import { Interval, Market } from 'src/utils/type/type-definition';
import { LoadLiveIndicatorPort } from '../../../application/port/external/load-live-indicator.port';

export const DAY_NUMBER_OF_DAYS = 35;
export const WEEK_NUMBER_OF_DAYS = 240;
export const MONTH_NUMBER_OF_DAYS = 1000;
export const YEAR_NUMBER_OF_DAYS = 10000;

@Injectable()
export class FluctuatingIndicatorKrxAdapter implements LoadFluctuatingIndicatorPort, LoadLiveIndicatorPort {
  constructor(private readonly api: HttpService) {}

  async loadFluctuatingIndicator(
    dataCount: number,
    ticker: string,
    interval: Interval,
    market: Market,
    endDate: string,
  ): Promise<FluctuatingIndicatorDto> {
    const startDate = this.getStartDate(endDate, dataCount);
    const responseData = await this.createKRXResponseData(dataCount, ticker, market, startDate, endDate);
    return FluctuatingIndicatorKrxAdapter.transferredByInterval(interval, responseData);
  }

  async loadLiveIndicator(ticker: string, interval: Interval, market: Market): Promise<FluctuatingIndicatorDto> {
    const endDate = this.dateFormatter(new Date());
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

    return FluctuatingIndicatorKrxAdapter.transferredByInterval(interval, responseData);
  }

  async createKRXResponseData(
    dataCount: number,
    ticker: string,
    market: Market,
    startDate: string,
    endDate: string,
  ): Promise<FluctuatingIndicatorDto> {
    // KRX API 통신 -> 현재 일자부터 이전 데이터 모두 조회
    const serviceKey: string = process.env.SERVICE_KEY;
    const request_url: string = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${serviceKey}&numOfRows=${dataCount}&pageNo=1&resultType=json&beginBasDt=${startDate}&endBasDt=${endDate}&likeSrtnCd=${ticker}&mrktCls=${market.toUpperCase()}`;

    const res = await this.api.axiosRef.get(request_url);
    const totalCount = res.data.response.body.totalCount;
    const rawItems = res.data.response.body.items.item;

    const items = [];
    for (let i = 0; i < rawItems.length; i++) {
      const { basDt, clpr } = rawItems[i];

      items.push({
        date: basDt,
        value: clpr,
      });
    }

    const type = 'k-stock';
    const responseData = FluctuatingIndicatorDto.create({
      type,
      ticker,
      name: rawItems.itmsNm,
      market,
      totalCount,
      items,
    });

    if (!responseData) {
      throw new NotFoundException('[ERROR] API response body is undefined');
    }
    return responseData;
  }

  static transferredByInterval(interval: Interval, data: FluctuatingIndicatorDto) {
    switch (interval) {
      case 'day':
        return data;
      case 'week':
        return this.calculateWeeklyAverage(data);
      case 'month':
        return this.calculateMonthlyAverage(data);
      case 'year':
        return this.calculateYearlyAverage(data);
    }
  }

  static calculateWeeklyAverage(data: FluctuatingIndicatorDto) {
    const items = data.items;
    const weeklyAverages = [];
    const processedWeeks = new Set();

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const weeklyItems = items.filter((item) => {
        const itemDate = new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameWeek =
          currentDate.getFullYear() === itemDate.getFullYear() &&
          this.getISOWeekNumber(currentDate) === this.getISOWeekNumber(itemDate);

        return isSameWeek;
      });

      if (weeklyItems.length > 0) {
        const weekIdentifier = `${currentDate.getFullYear()}-${this.getISOWeekNumber(currentDate)}`;

        if (!processedWeeks.has(weekIdentifier)) {
          const weeklyValueSum = weeklyItems.reduce((sum, item) => sum + parseInt(item.value), 0);
          const weeklyAverage = weeklyValueSum / weeklyItems.length;

          const { date } = weeklyItems[0];

          weeklyAverages.push({
            date,
            value: weeklyAverage.toFixed(2),
          });

          processedWeeks.add(weekIdentifier);
        }
      }
    }
    data.items = weeklyAverages;
    return data;
  }

  static getISOWeekNumber(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
    return weekNumber;
  }

  static calculateMonthlyAverage(data: FluctuatingIndicatorDto) {
    const items = data.items;
    const monthlyAverages = [];
    const processedMonths = new Set();

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const monthlyItems = items.filter((item) => {
        const itemDate = new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameMonth =
          currentDate.getFullYear() === itemDate.getFullYear() && currentDate.getMonth() === itemDate.getMonth();

        return isSameMonth;
      });

      if (monthlyItems.length > 0) {
        const monthIdentifier = currentDate.getMonth();

        if (!processedMonths.has(monthIdentifier)) {
          const monthlyValueSum = monthlyItems.reduce((sum, item) => sum + parseInt(item.value), 0);
          const monthlyAverage = monthlyValueSum / monthlyItems.length;

          const { date } = monthlyItems[0];

          monthlyAverages.push({
            date,
            value: monthlyAverage.toFixed(2),
          });

          processedMonths.add(monthIdentifier);
        }
      }
    }
    data.items = monthlyAverages;
    return data;
  }

  static calculateYearlyAverage(data: FluctuatingIndicatorDto) {
    const items = data.items;
    const yearlyAverages = [];
    const processedYears = new Set();

    for (let i = 0; i < items.length; i++) {
      const currentDate = new Date(items[i].date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

      const yearlyItems = items.filter((item) => {
        const itemDate = new Date(item.date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));

        const isSameYear = currentDate.getFullYear() === itemDate.getFullYear();

        return isSameYear;
      });

      if (yearlyItems.length > 0) {
        const yearIdentifier = currentDate.getFullYear();

        if (!processedYears.has(yearIdentifier)) {
          const yearlyValueSum = yearlyItems.reduce((sum, item) => sum + parseInt(item.value), 0);
          const yearlyAverage = yearlyValueSum / yearlyItems.length;

          const { date } = yearlyItems[0];

          yearlyAverages.push({
            date,
            value: yearlyAverage.toFixed(2),
          });

          processedYears.add(yearIdentifier);
        }
      }
    }

    data.items = yearlyAverages;

    return data;
  }

  private dateFormatter(today: Date): string {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  private getStartDate(baseDateString: string, numOfDays: number) {
    const year = baseDateString.substring(0, 4);
    const month = baseDateString.substring(4, 6);
    const day = baseDateString.substring(6, 8);

    const baseDate = new Date(`${year}-${month}-${day}`);
    const pastDate = new Date(baseDate);
    pastDate.setDate(baseDate.getDate() - numOfDays);

    return this.dateFormatter(pastDate);
  }
}
