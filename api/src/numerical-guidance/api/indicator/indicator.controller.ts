import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetIndicatorListQuery } from '../../application/query/indicator/get-indicator-list/get-indicator-list.query';
import { SaveIndicatorListCommand } from '../../application/command/indicator/save-indicator-list/save-indicator-list.command';
import { ApiPaginatedResponseDecorator } from '../../../utils/pagination/api-paginated-response.decorator';
import { StockDto } from '../../application/query/indicator/get-indicator-list/dto/stock.dto';
import { GetIndicatorListDto } from './dto/get-indicator-list.dto';
import { SearchTwelveIndicatorQuery } from '../../application/query/indicator/search-twelve-indicator/search-twelve-indicator.query';
import { CursorPageDto } from '../../../utils/pagination/cursor-page.dto';
import { SearchedIndicatorsDto } from '../../application/query/indicator/search-twelve-indicator/dto/searched-indicators.dto';
import { IndicatorDtoType } from '../../../utils/type/type-definition';
import { SaveIndicatorListDto } from '../../application/command/indicator/save-indicator-list/dto/save-indicator-list.dto';
import { Public } from '../../../auth/util/is-public.decorator';
import { SearchIndicatorQuery } from 'src/numerical-guidance/application/query/indicator/search-indicator/search-indicator.query';
import { SearchIndicatorDto } from './dto/search-indicator.dto';
import { SearchTwelveSymbolDto } from '../../../../dist/numerical-guidance/api/indicator/dto/search-twelve-symbol.dto';

@ApiTags('IndicatorController')
@Controller('/api/numerical-guidance/indicator')
export class IndicatorController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '지표 리스트를 저장합니다.' })
  @Public()
  @Post('/list')
  async saveIndicatorList(@Query() saveIndicatorListDto: SaveIndicatorListDto): Promise<void> {
    const command = new SaveIndicatorListCommand(saveIndicatorListDto.count, saveIndicatorListDto.country);
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
  @Public()
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
  @Public()
  @Get('/twelve/search')
  async searchTwelveIndicator(@Query() searchTwelveSymbolDto: SearchTwelveSymbolDto): Promise<SearchedIndicatorsDto> {
    const query = new SearchTwelveIndicatorQuery(searchTwelveSymbolDto.symbol);
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표 symbol로 지표를 검색합니다. - DB 활용' })
  @ApiOkResponse({ type: '53c422bd-083a-4732-8ebe-ec72f19135dd' })
  @ApiExceptionResponse(
    400,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] ${symbol}: 잘못된 형식의 symbol요청입니다.',
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] symbol: ${symbol} 해당 symbol의 indicator를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표id를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
  )
  @Public()
  @Get('/search')
  async searchIndicator(
    @Query() searchIndicatorDto: SearchIndicatorDto,
  ): Promise<IndicatorDtoType | IndicatorDtoType[]> {
    const { symbol, type } = searchIndicatorDto;
    const query = new SearchIndicatorQuery(symbol, type);
    return await this.queryBus.execute(query);
  }
}
