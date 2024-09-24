import { CachingQuoteIndicatorPort } from '../../../application/port/cache/caching-quote-indicator.port';
import { IndicatorQuoteData } from '../../../application/query/quote-indicator/get-quote-indicator/interface/quote-indicator-data.interface';
import { IndicatorDtoType } from '../../../../utils/type/type-definition';
import { LoadCachedQuoteIndicatorPort } from '../../../application/port/cache/load-cached-quote-indicator.port';
import { BaseRedisAdapter } from './base-redis.adapter';
import { QuoteIndicatorIntervalEnum } from '../../../../utils/enum/enum-definition';
import { QuoteIndicatorMapper } from '../twelve/mapper/quote-indicator.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuoteIndicatorRedisAdapter
  extends BaseRedisAdapter
  implements LoadCachedQuoteIndicatorPort, CachingQuoteIndicatorPort
{
  async cachingQuoteIndicator(
    quoteIndicatorDto: IndicatorQuoteData,
    indicatorDto: IndicatorDtoType,
    interval: QuoteIndicatorIntervalEnum,
    timezone: string,
  ): Promise<IndicatorQuoteData> {
    const key = this.createQuoteIndicatorKey(indicatorDto, interval, timezone, quoteIndicatorDto.datetime);
    const data = JSON.stringify(quoteIndicatorDto);
    const expiredTime = this.calculateExpiredTime(interval);

    await this.redis.set(key, data);
    await this.redis.expire(key, expiredTime);

    return quoteIndicatorDto;
  }

  async loadCachedQuoteIndicator(
    indicatorDto: IndicatorDtoType,
    interval: QuoteIndicatorIntervalEnum,
    nowDate: Date,
    timezone: string,
  ): Promise<IndicatorQuoteData> {
    const currentData: IndicatorQuoteData = await this.loadQuoteData(interval, nowDate, indicatorDto, timezone);
    if (currentData) {
      return currentData;
    }
    const previousDate: Date = this.datetimeMinusInterval(interval, nowDate);
    return this.loadQuoteData(interval, previousDate, indicatorDto, timezone);
  }

  private createQuoteIndicatorKey(
    indicatorDto: IndicatorDtoType,
    interval: QuoteIndicatorIntervalEnum,
    timezone: string,
    datetime: string,
  ): string {
    return `${indicatorDto.indicatorType}/quote-${indicatorDto.symbol}:${interval}:${timezone}:${datetime}`;
  }

  private calculateExpiredTime(interval: QuoteIndicatorIntervalEnum): number {
    let expirationTime = 0;
    switch (interval) {
      case QuoteIndicatorIntervalEnum.MIN1:
        expirationTime = 1 * 60 * 1000; // 1분
        break;
      case QuoteIndicatorIntervalEnum.MIN5:
        expirationTime = 5 * 60 * 1000; // 5분
        break;
      case QuoteIndicatorIntervalEnum.MIN15:
        expirationTime = 15 * 60 * 1000; // 15분
        break;
      case QuoteIndicatorIntervalEnum.MIN30:
        expirationTime = 30 * 60 * 1000; // 30분
        break;
      case QuoteIndicatorIntervalEnum.MIN45:
        expirationTime = 45 * 60 * 1000; // 45분
        break;
      case QuoteIndicatorIntervalEnum.HOUR1:
        expirationTime = 1 * 60 * 60 * 1000; // 1시간
        break;
      case QuoteIndicatorIntervalEnum.HOUR2:
        expirationTime = 2 * 60 * 60 * 1000; // 2시간
        break;
      case QuoteIndicatorIntervalEnum.HOUR4:
        expirationTime = 4 * 60 * 60 * 1000; // 4시간
        break;
      case QuoteIndicatorIntervalEnum.DAY1:
        expirationTime = 24 * 60 * 60 * 1000; // 1일
        break;
      case QuoteIndicatorIntervalEnum.WEEK1:
        expirationTime = 7 * 24 * 60 * 60 * 1000; // 1주일
        break;
      case QuoteIndicatorIntervalEnum.MONTH1:
        expirationTime = 30 * 24 * 60 * 60 * 1000; // 1개월
        break;
    }
    return expirationTime * 2;
  }

  private calculateKeyDatetime(interval: QuoteIndicatorIntervalEnum, nowDate: Date): string {
    const timestamp = nowDate.getTime();
    const today = new Date(timestamp);
    let timestampWithoutInterval;
    switch (interval) {
      case QuoteIndicatorIntervalEnum.MIN1:
        timestampWithoutInterval = 1 * 60 * 1000; // 1분
        break;
      case QuoteIndicatorIntervalEnum.MIN5:
        timestampWithoutInterval = 5 * 60 * 1000; // 5분
        break;
      case QuoteIndicatorIntervalEnum.MIN15:
        timestampWithoutInterval = 15 * 60 * 1000; // 15분
        break;
      case QuoteIndicatorIntervalEnum.MIN30:
        timestampWithoutInterval = 30 * 60 * 1000; // 30분
        break;
      case QuoteIndicatorIntervalEnum.MIN45:
        timestampWithoutInterval = 45 * 60 * 1000; // 45분
        break;
      case QuoteIndicatorIntervalEnum.HOUR1:
        timestampWithoutInterval = 1 * 60 * 60 * 1000; // 1시간
        break;
      case QuoteIndicatorIntervalEnum.HOUR2:
        timestampWithoutInterval = 2 * 60 * 60 * 1000; // 2시간
        break;
      case QuoteIndicatorIntervalEnum.HOUR4:
        timestampWithoutInterval = 4 * 60 * 60 * 1000; // 4시간
        break;
      case QuoteIndicatorIntervalEnum.DAY1:
        today.setDate(today.getDate() - 1);
        return today.toISOString().slice(0, 10);
      case QuoteIndicatorIntervalEnum.WEEK1:
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
        return monday.toISOString().slice(0, 10);
      case QuoteIndicatorIntervalEnum.MONTH1:
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return firstDayOfMonth.toISOString().slice(0, 10);
    }
    const intervalDate = new Date(timestamp - (timestamp % timestampWithoutInterval));
    return intervalDate.toISOString().slice(0, 19).replace('T', ' ');
  }

  private datetimeMinusInterval(interval: QuoteIndicatorIntervalEnum, nowDate: Date): Date {
    const previousDate = new Date(nowDate);
    switch (interval) {
      case QuoteIndicatorIntervalEnum.MIN1:
        previousDate.setMinutes(nowDate.getMinutes() - 1);
        break;
      case QuoteIndicatorIntervalEnum.MIN5:
        previousDate.setMinutes(nowDate.getMinutes() - 5);
        break;
      case QuoteIndicatorIntervalEnum.MIN15:
        previousDate.setMinutes(nowDate.getMinutes() - 15);
        break;
      case QuoteIndicatorIntervalEnum.MIN30:
        previousDate.setMinutes(nowDate.getMinutes() - 30);
        break;
      case QuoteIndicatorIntervalEnum.MIN45:
        previousDate.setMinutes(nowDate.getMinutes() - 45);
        break;
      case QuoteIndicatorIntervalEnum.HOUR1:
        previousDate.setHours(nowDate.getHours() - 1);
        break;
      case QuoteIndicatorIntervalEnum.HOUR2:
        previousDate.setHours(nowDate.getHours() - 2);
        break;
      case QuoteIndicatorIntervalEnum.HOUR4:
        previousDate.setHours(nowDate.getHours() - 4);
        break;
      case QuoteIndicatorIntervalEnum.DAY1:
        previousDate.setDate(nowDate.getDate() - 1);
        break;
      case QuoteIndicatorIntervalEnum.WEEK1:
        previousDate.setDate(nowDate.getDate() - 7);
        break;
      case QuoteIndicatorIntervalEnum.MONTH1:
        previousDate.setMonth(nowDate.getMonth() - 1);
        break;
    }
    return previousDate;
  }

  private async loadQuoteData(
    interval: QuoteIndicatorIntervalEnum,
    date: Date,
    indicatorDto: IndicatorDtoType,
    timezone: string,
  ): Promise<IndicatorQuoteData> {
    const datetime = this.calculateKeyDatetime(interval, date);
    const key = this.createQuoteIndicatorKey(indicatorDto, interval, timezone, datetime);
    const data = await this.redis.get(key);

    return data ? QuoteIndicatorMapper.mapStringToDto(indicatorDto.indicatorType, data) : null;
  }
}
