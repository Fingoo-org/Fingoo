import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Indicator, IndicatorSwaggerSchema } from '../../application/query/indicator/basic/dto/indicator.dto';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { GetIndicatorsQuery } from '../../application/query/indicator/basic/get-indicator/get-indicators.query';
import { GetIndicatorListQuery } from '../../application/query/indicator/get-indicator-list.query';
import { SaveIndicatorListCommand } from '../../application/command/indicator/save-indicator-list/save-indicator-list.command';
import { ApiPaginatedResponseDecorator } from '../../../utils/pagination/api-paginated-response.decorator';
import { BondsDto } from '../../application/query/indicator/dto/bonds.dto';
import { CryptoCurrenciesDto } from '../../application/query/indicator/dto/crypto-currencies.dto';
import { ETFDto } from '../../application/query/indicator/dto/etf.dto';
import { ForexPairDto } from '../../application/query/indicator/dto/forex-pair.dto';
import { IndicesDto } from '../../application/query/indicator/dto/indices.dto';
import { StockDto } from '../../application/query/indicator/dto/stock.dto';
import { FundDto } from '../../application/query/indicator/dto/fund.dto';
import { GetIndicatorListDto } from './dto/get-indicator-list.dto';

@ApiTags('IndicatorController')
@Controller('/api/numerical-guidance/indicator')
export class IndicatorController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  // TODO: twelve 안정화 이후 삭제
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
  @Get()
  async getIndicators(): Promise<Indicator[]> {
    const query = new GetIndicatorsQuery();
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표 리스트를 저장합니다.' })
  @Post('/list')
  async saveIndicatorList(): Promise<void> {
    const command = new SaveIndicatorListCommand();
    return this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표 리스트를 불러옵니다.' })
  @ApiPaginatedResponseDecorator(BondsDto)
  @ApiPaginatedResponseDecorator(CryptoCurrenciesDto)
  @ApiPaginatedResponseDecorator(ETFDto)
  @ApiPaginatedResponseDecorator(ForexPairDto)
  @ApiPaginatedResponseDecorator(IndicesDto)
  @ApiPaginatedResponseDecorator(StockDto)
  @ApiPaginatedResponseDecorator(FundDto)
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
  async getIndicatorList(@Query(ValidationPipe) getIndicatorListDto: GetIndicatorListDto) {
    const query = new GetIndicatorListQuery(getIndicatorListDto.type, getIndicatorListDto.cursorToken);
    return this.queryBus.execute(query);
  }
}
