import { Body, Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorsQuery } from '../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query';
import { FluctuatingIndicatorsDto } from '../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorsDto } from './dto/get-fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorWithoutCacheDto } from './dto/get-fluctuatingIndicator-without-cache.dto';
import { GetFluctuatingIndicatorWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicators-without-cache/get-fluctuatingIndicator-without-cache.query';
import { IndicatorListDto } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';
import { GetIndicatorListQuery } from 'src/numerical-guidance/application/query/get-indicator-list/get-indicator-list.query';

@Controller('/numerical-guidance')
export class NumericalGuidanceController {
  constructor(private queryBus: QueryBus) {}

  @Get('/fluctuatingIndicators')
  async getFluctuatingIndicators(
    @Body() getFluctuatingIndicatorsDto: GetFluctuatingIndicatorsDto,
  ): Promise<FluctuatingIndicatorsDto> {
    const query = new GetFluctuatingIndicatorsQuery(
      getFluctuatingIndicatorsDto.dataCount,
      getFluctuatingIndicatorsDto.fluctuatingIndicatorInfos,
      getFluctuatingIndicatorsDto.interval,
      getFluctuatingIndicatorsDto.endDate,
    );
    return this.queryBus.execute(query);
  }

  @Get('/without-cache')
  async getFluctuatingIndicatorWithoutCache(
    @Query() getFluctuatingIndicatorWithoutCacheDto: GetFluctuatingIndicatorWithoutCacheDto,
  ): Promise<FluctuatingIndicatorsDto> {
    const query = new GetFluctuatingIndicatorWithoutCacheQuery(
      getFluctuatingIndicatorWithoutCacheDto.dataCount,
      getFluctuatingIndicatorWithoutCacheDto.ticker,
      getFluctuatingIndicatorWithoutCacheDto.interval,
      getFluctuatingIndicatorWithoutCacheDto.market,
      getFluctuatingIndicatorWithoutCacheDto.endDate,
    );
    return this.queryBus.execute(query);
  }

  @Get('/get-indicator-list')
  async getIndicatorList(): Promise<IndicatorListDto> {
    const query = new GetIndicatorListQuery();
    return this.queryBus.execute(query);
  }
}
