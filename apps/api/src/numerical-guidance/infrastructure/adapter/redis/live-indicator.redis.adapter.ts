import { Injectable } from '@nestjs/common';
import { LoadCachedLiveIndicatorPort } from '../../../application/port/cache/load-cached-live-indicator.port';
import { CachingLiveIndicatorPort } from '../../../application/port/cache/caching-live-indicator.port';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { LiveIndicatorMapper } from '../twelve/mapper/live-indicator.mapper';
import { Interval, LiveIndicatorDtoType } from '../../../../utils/type/type-definition';

const SECONDS_IN_DAY = 86400;
const DAYS_IN_WEEK = 7;
const CALCULATING_WEEK_NUM = 8;
const DAYS_IN_MONTH = 30;
const DECEMBER = 11;
const LAST_DAY_OF_DECEMBER = 31;
const JS_MONTH_CAL_NUM = 1;
const EXTRA_DAY = 1;

@Injectable()
export class LiveIndicatorRedisAdapter implements LoadCachedLiveIndicatorPort, CachingLiveIndicatorPort {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async loadCachedLiveIndicator(key: string): Promise<LiveIndicatorDtoType> {
    const data: string = await this.redis.get(key);
    const indicatorType = key.split('/')[0];
    return data && LiveIndicatorMapper.mapToDto(indicatorType, data);
  }

  async cachingLiveIndicator(key: string, indicatorDto: LiveIndicatorDtoType): Promise<void> {
    const value: string = JSON.stringify(indicatorDto);
    const expireTime = this.calculateExpireTime(key);

    await this.redis.set(key, value);
    await this.redis.expire(key, expireTime);
  }

  async disconnectRedis() {
    this.redis.disconnect();
  }

  private calculateExpireTime(key: string): number {
    const currentDate = new Date();
    const intervalType = this.extractIntervalType(key);

    return this.calculateRemainingSeconds(currentDate, intervalType);
  }

  private extractIntervalType(key: string): Interval {
    if (key.includes('-interval:day-')) {
      return 'day';
    } else if (key.includes('-interval:week-')) {
      return 'week';
    } else if (key.includes('-interval:month-')) {
      return 'month';
    } else if (key.includes('-interval:year-')) {
      return 'year';
    }
  }

  private calculateRemainingSeconds(currentDate: Date, intervalType: string): number {
    switch (intervalType) {
      case 'day':
        return SECONDS_IN_DAY;
      case 'week':
        return this.calculateWeekRemainingSeconds(currentDate);
      case 'month':
        return this.calculateMonthRemainingSeconds(currentDate);
      case 'year':
        return this.calculateYearRemainingSeconds(currentDate);
      default:
        return SECONDS_IN_DAY;
    }
  }

  private calculateWeekRemainingSeconds(currentDate: Date): number {
    const dayOfWeek = currentDate.getDay(); // 0 (일요일) ~ 6 (토요일)
    let remainingDays = ((DAYS_IN_WEEK + JS_MONTH_CAL_NUM - dayOfWeek) % CALCULATING_WEEK_NUM) + EXTRA_DAY; // 주말까지 남은 일수 계산
    if (remainingDays == 1) remainingDays += EXTRA_DAY;
    return remainingDays * SECONDS_IN_DAY;
  }

  private calculateMonthRemainingSeconds(currentDate: Date): number {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDayOfMonth = new Date(year, month + JS_MONTH_CAL_NUM, 0).getDate();
    const remainingDays = lastDayOfMonth - currentDate.getDate() + EXTRA_DAY;
    return remainingDays * SECONDS_IN_DAY;
  }

  private calculateYearRemainingSeconds(currentDate: Date): number {
    const year = currentDate.getFullYear();
    const lastDayOfYear = new Date(year, DECEMBER, LAST_DAY_OF_DECEMBER).getDate();
    const remainingDays =
      lastDayOfYear -
      currentDate.getDate() +
      (new Date(year, DECEMBER, LAST_DAY_OF_DECEMBER).getMonth() - currentDate.getMonth()) * DAYS_IN_MONTH +
      EXTRA_DAY;
    return remainingDays * SECONDS_IN_DAY;
  }
}
