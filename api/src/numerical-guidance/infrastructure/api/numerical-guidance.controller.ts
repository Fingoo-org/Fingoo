import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorQuery } from '../../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query';
import { FluctuatingIndicatorDto } from '../../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorDto } from './dto/get-fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorWithoutCacheDto } from './dto/get-fluctuatingIndicator-without-cache.dto';
import { GetFluctuatingIndicatorWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('NumericalGuidanceController')
@Controller('/numerical-guidance')
export class NumericalGuidanceController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: '변동지표를 불러옵니다.' })
  @Get('/fluctuatingIndicator')
  async getFluctuatingIndicator(
    @Query() getFluctuatingIndicatorDto: GetFluctuatingIndicatorDto,
  ): Promise<FluctuatingIndicatorDto> {
    const query = new GetFluctuatingIndicatorQuery(
      getFluctuatingIndicatorDto.dataCount,
      getFluctuatingIndicatorDto.ticker,
      getFluctuatingIndicatorDto.market,
      getFluctuatingIndicatorDto.interval,
      getFluctuatingIndicatorDto.endDate,
    );
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '캐시와 상관없이 변동지표를 불러옵니다.' })
  @Get('/without-cache')
  async getFluctuatingIndicatorWithoutCache(
    @Query() getFluctuatingIndicatorWithoutCacheDto: GetFluctuatingIndicatorWithoutCacheDto,
  ): Promise<FluctuatingIndicatorDto> {
    const query = new GetFluctuatingIndicatorWithoutCacheQuery(
      getFluctuatingIndicatorWithoutCacheDto.dataCount,
      getFluctuatingIndicatorWithoutCacheDto.ticker,
      getFluctuatingIndicatorWithoutCacheDto.interval,
      getFluctuatingIndicatorWithoutCacheDto.market,
      getFluctuatingIndicatorWithoutCacheDto.endDate,
    );
    return this.queryBus.execute(query);
  }
}
