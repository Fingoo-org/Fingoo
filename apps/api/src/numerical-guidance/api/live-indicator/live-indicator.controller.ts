import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { LiveStockDto } from '../../application/query/live-indicator/get-live-indicator/dto/live-stock.dto';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetLiveIndicatorDto } from './dto/get-live-indicator.dto';
import { GetLiveIndicatorQuery } from '../../application/query/live-indicator/get-live-indicator/get-live-indicator.query';
import { Public } from 'src/auth/util/is-public.decorator';

@ApiTags('LiveIndicatorController')
@Controller('/api/numerical-guidance')
export class LiveIndicatorController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: 'Live 지표를 불러옵니다.' })
  @ApiOkResponse({ type: LiveStockDto })
  @ApiExceptionResponse(
    400,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] 현재 startDate에 해당하는 데이터가 존재하지 않습니다. 1901년 01월 01일 이후의 날짜를 입력해주세요.',
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] Twelve API response 값을 찾을 수 없습니다. (해당 지표는 현재 plan에서 사용할 수 없습니다.)',
  )
  @Public()
  @Get('/indicators/live')
  async getLiveIndicator(@Query() getLiveIndicatorDto: GetLiveIndicatorDto): Promise<LiveStockDto> {
    const { indicatorId, interval, indicatorType, startDate } = getLiveIndicatorDto;
    const query = new GetLiveIndicatorQuery(indicatorId, interval, startDate, indicatorType);
    return this.queryBus.execute(query);
  }
}
