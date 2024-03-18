import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Indicator, IndicatorSwaggerSchema } from '../../application/query/get-indicator/indicator.dto';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetIndicatorsQuery } from '../../application/query/get-indicator/get-indicators.query';

@ApiTags('IndicatorController')
@Controller('/api/numerical-guidance')
export class IndicatorController {
  constructor(private queryBus: QueryBus) {}

  @ApiOperation({ summary: '지표 리스트를 불러옵니다.' })
  @ApiOkResponse({ type: [IndicatorSwaggerSchema] })
  @ApiExceptionResponse(
    400,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] 지표를 불러오는 도중에 entity 오류가 발생했습니다.',
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] 지표들을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
  )
  @Get('/indicator')
  async getIndicators(): Promise<Indicator[]> {
    const query = new GetIndicatorsQuery();
    return this.queryBus.execute(query);
  }
}
