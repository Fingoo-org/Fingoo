import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Indicator, IndicatorSwaggerSchema } from '../../application/query/indicator/basic/dto/indicator.dto';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetIndicatorsQuery } from '../../application/query/indicator/basic/get-indicator/get-indicators.query';
import { GetIndicatorListQuery } from '../../application/query/indicator/get-indicator-list.query';
import { IndicatorType } from '../../../utils/type/type-definition';
import { SaveIndicatorListCommand } from '../../application/command/indicator/save-indicator-list/save-indicator-list.command';

@ApiTags('IndicatorController')
@Controller('/api/numerical-guidance')
export class IndicatorController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '지표 리스트를 불러옵니다.(삭제 예정)' })
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

  @ApiOperation({ summary: '지표 리스트를 저장합니다.' })
  @Post('/indicator-list')
  async saveIndicatorList(): Promise<void> {
    const command = new SaveIndicatorListCommand();
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표 리스트를 불러옵니다.' })
  @Get('/indicator-list')
  async getIndicatorList(@Query('type') type: IndicatorType): Promise<void> {
    const query = new GetIndicatorListQuery(type);
    return this.queryBus.execute(query);
  }
}
