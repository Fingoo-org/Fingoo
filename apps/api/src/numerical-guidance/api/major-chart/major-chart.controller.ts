import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetMajorChartQuery } from '../../../numerical-guidance/application/query/major-chart/get-major-chart.query';
import { Public } from '../../../auth/util/is-public.decorator';
import { GetMajorChartDto } from './dto/get-major-chart.dto';

@ApiTags('MajorChartController')
@Controller('/api/major-chart')
export class MajorChartController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: '국가별 주요 지표를 읽습니다.' })
  @ApiParam({
    name: 'country',
    example: 'US',
    required: true,
  })
  @ApiOkResponse({ type: GetMajorChartDto, isArray: true })
  @Get('/:country')
  @Public()
  async loadMajorChart(@Param('country') country) {
    const query = new GetMajorChartQuery(country);
    return this.queryBus.execute(query);
  }
}
