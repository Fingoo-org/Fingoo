import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetIndicatorListQuery } from '../../application/query/indicator/get-indicator-list/get-indicator-list.query';
import { SaveIndicatorListCommand } from '../../application/command/indicator/save-indicator-list/save-indicator-list.command';
import { ApiPaginatedResponseDecorator } from '../../../utils/pagination/api-paginated-response.decorator';
import { StockDto } from '../../application/query/indicator/get-indicator-list/dto/stock.dto';
import { GetIndicatorListDto } from './dto/get-indicator-list.dto';
import { SearchIndicatorQuery } from '../../application/query/indicator/get-indicator-search/search-indicator.query';
import { CursorPageDto } from '../../../utils/pagination/cursor-page.dto';
import { SearchedIndicatorsDto } from '../../application/query/indicator/get-indicator-search/dto/searched-indicators.dto';
import { SearchSymbolDto } from './dto/search-symbol.dto';
import { IndicatorDtoType } from '../../../utils/type/type-definition';

@ApiTags('IndicatorController')
@Controller('/api/numerical-guidance/indicator')
export class IndicatorController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '지표 리스트를 저장합니다.' })
  @Post('/list')
  async saveIndicatorList(@Query('count') count: number): Promise<void> {
    const command = new SaveIndicatorListCommand(count);
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표 리스트를 불러옵니다.' })
  @ApiPaginatedResponseDecorator(StockDto)
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] index, type 요청이 올바른지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    `[ERROR] index: 3 해당 index의 indicator를 찾을 수 없습니다.`,
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표 리스트를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
  )
  @Get('/list')
  async getIndicatorList(@Query() getIndicatorListDto: GetIndicatorListDto): Promise<CursorPageDto<IndicatorDtoType>> {
    const query = new GetIndicatorListQuery(getIndicatorListDto.type, getIndicatorListDto.cursorToken);
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표 symbol을 검색합니다.' })
  @ApiOkResponse({ type: [SearchedIndicatorsDto] })
  @ApiExceptionResponse(
    400,
    '검색할 symbol 요청이 올바른지 확인해주세요.',
    `[ERROR] 검색할 symbol 요청이 올바른지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    `[ERROR] symbol: AA 해당 symbol을 찾을 수 없습니다.`,
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표를 검색하는 중 중에 예상치 못한 문제가 발생했습니다.',
  )
  @Get('/search')
  async searchIndicator(@Query() searchSymbolDto: SearchSymbolDto): Promise<SearchedIndicatorsDto> {
    console.log(searchSymbolDto.symbol);
    const query = new SearchIndicatorQuery(searchSymbolDto.symbol);
    return this.queryBus.execute(query);
  }
}
