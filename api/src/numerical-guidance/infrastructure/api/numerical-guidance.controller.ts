import { Body, Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorsQuery } from '../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query';
import { FluctuatingIndicatorsDto } from '../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorsDto } from './dto/get-fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorsWithoutCacheDto } from './dto/get-fluctuatingIndicators-without-dto';
import { FluctuatingIndicatorsWithoutCacheDto } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/flucruatingIndicator-without-cache.dto';
import { GetFluctuatingIndicatorsWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query';

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
    );
    return this.queryBus.execute(query);
  }

  @Get('/without-cache')
  async getFluctuatingIndicatorsWithoutCache(
    @Query() getFluctuatingIndicatorsWithoutCacheDto: GetFluctuatingIndicatorsWithoutCacheDto,
  ): Promise<FluctuatingIndicatorsWithoutCacheDto> {
    const query = new GetFluctuatingIndicatorsWithoutCacheQuery(
      getFluctuatingIndicatorsWithoutCacheDto.dataCount,
      getFluctuatingIndicatorsWithoutCacheDto.ticker,
      getFluctuatingIndicatorsWithoutCacheDto.market,
    );
    return this.queryBus.execute(query);
  }
}
