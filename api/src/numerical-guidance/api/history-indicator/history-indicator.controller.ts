import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiPaginatedResponseDecorator } from '../../../utils/pagination/api-paginated-response.decorator';
import { IndicatorValueSwaggerSchema } from '../../application/query/live-indicator/dto/live-indicator.dto';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetHistoryIndicatorDto } from './dto/get-history-indicator.dto';
import { CursorPageDto } from '../../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../../application/query/history-indicator/dto/history-indicator.dto';
import { GetHistoryIndicatorQuery } from '../../application/query/history-indicator/get-history-indicator/get-history-indicator.query';

@ApiTags('HistoryIndicatorController')
@Controller('/api/numerical-guidance')
export class HistoryIndicatorController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: 'History 지표를 불러옵니다.' })
  @ApiPaginatedResponseDecorator(IndicatorValueSwaggerSchema)
  @ApiExceptionResponse(
    404,
    '입력값이 올바른지 확인해주세요.',
    `[ERROR] 지표를 cursor pagination 하는 중에 dataCount, endDate에 대한 entity를 찾지 못 했습니다. 올바른 날짜를 입력했는지 확인해주세요.`,
  )
  @Get('/indicators/history')
  async getHistoryIndicator(
    @Query() getHistoryIndicatorDto: GetHistoryIndicatorDto,
  ): Promise<CursorPageDto<HistoryIndicatorDto>> {
    const query = new GetHistoryIndicatorQuery(
      getHistoryIndicatorDto.indicatorId,
      getHistoryIndicatorDto.interval,
      getHistoryIndicatorDto.dataCount,
      getHistoryIndicatorDto.endDate,
    );

    return this.queryBus.execute(query);
  }
}
