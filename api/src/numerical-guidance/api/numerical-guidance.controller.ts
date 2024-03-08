import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorQuery } from '../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query';
import {
  FluctuatingIndicatorDto,
  IndicatorValueSwaggerSchema,
} from '../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorDto } from './dto/get-fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorWithoutCacheDto } from './dto/get-fluctuatingIndicator-without-cache.dto';
import {
  Indicator,
  IndicatorSwaggerSchema,
} from 'src/numerical-guidance/application/query/get-indicator/indicator.dto';
import { GetIndicatorsQuery } from 'src/numerical-guidance/application/query/get-indicator/get-indicators.query';
import { GetFluctuatingIndicatorWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateIndicatorBoardMetadataDto } from './dto/create-indicator-board-metadata.dto';
import { CreateIndicatorBoardMetadataCommand } from '../application/command/create-indicator-board-metadata/create-indicator-board-metadata.command';
import { Response } from 'express';
import { GetIndicatorBoardMetadataQuery } from '../application/query/get-indicator-board-metadata/get-indicator-board-metadata.query';
import { IndicatorBoardMetadata } from '../domain/indicator-board-metadata';
import { InsertIndicatorIdCommand } from '../application/command/insert-indicator-id/insert-indicator-id.command';
import { InsertIndicatorDto } from './dto/insert-indicator.dto';
import { GetIndicatorBoardMetadataListQuery } from '../application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query';
import { DeleteIndicatorIdCommand } from '../application/command/delete-indicator-id/delete-indicator-id.command';
import { DeleteIndicatorBoardMetadataCommand } from '../application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command';
import { UpdateIndicatorBoardMetadataNameDto } from './dto/update-indicator-board-metadata-name.dto';
import { UpdateIndicatorBoardMetadataNameCommand } from '../application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command';
import { AuthGuard } from '../../auth/auth.guard';
import { Member } from '../../auth/get-member.decorator';
import { MemberEntity } from '../../auth/member.entity';
import { GetLiveIndicatorQuery } from '../application/query/get-live-indicator/get-live-indicator.query';
import { GetLiveIndicatorDto } from './dto/get-live-indicator.dto';
import { GetHistoryIndicatorDto } from './dto/get-history-indicator.dto';
import { GetHistoryIndicatorQuery } from '../application/query/get-history-indicator/get-history-indicator.query';
import { CursorPageDto } from '../../utils/pagination/cursor-page.dto';
import { HistoryIndicatorDto } from '../application/query/get-history-indicator/history-indicator.dto';
import { CreateCustomForecatIndicatorDto } from './dto/create-custom-forecast-indicator.dto';
import { CreateCustomForecastIndicatorCommand } from '../application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command';
import { CustomForecastIndicator } from '../domain/custom-forecast-indicator';
import { GetCustomForecastIndicatorQuery } from '../application/query/get-custom-forecast-indicator/get-custom-forecast-indicator.query';
import { ApiPaginatedResponseDecorator } from '../../utils/pagination/api-paginated-response.decorator';
import { ApiExceptionResponse } from '../../utils/exception-filter/api-exception-response.decorator';

@ApiTags('NumericalGuidanceController')
@Controller('/api/numerical-guidance')
export class NumericalGuidanceController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '변동지표를 불러옵니다.' })
  @ApiOkResponse({ type: FluctuatingIndicatorDto })
  @ApiExceptionResponse(400, 'interval을 잘못 보냈을 때') // TODO: 예외 처리해야함
  @ApiExceptionResponse(404, '[ERROR] API response body 값을 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] KRX API 요청 과정에서 예상치 못한 오류가 발생했습니다.')
  @Get('/indicators/k-stock')
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

  @ApiOperation({ summary: 'Live 지표를 불러옵니다.' })
  @ApiOkResponse({ type: FluctuatingIndicatorDto })
  @ApiExceptionResponse(400, 'interval을 잘못 보냈을 때') // TODO: 예외 처리해야함
  @ApiExceptionResponse(404, '[ERROR] API response body 값을 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] KRX API 요청 과정에서 예상치 못한 오류가 발생했습니다.')
  @Get('/indicators/k-stock/live')
  async getLiveIndicator(@Query() getLiveIndicatorDto: GetLiveIndicatorDto): Promise<FluctuatingIndicatorDto> {
    const query = new GetLiveIndicatorQuery(getLiveIndicatorDto.indicatorId, getLiveIndicatorDto.interval);
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '캐시와 상관없이 변동지표를 불러옵니다.' })
  @ApiOkResponse({ type: FluctuatingIndicatorDto })
  @ApiExceptionResponse(400, 'interval을 잘못 보냈을 때') // TODO: 예외 처리해야함
  @ApiExceptionResponse(404, '[ERROR] API response body 값을 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] KRX API 요청 과정에서 예상치 못한 오류가 발생했습니다.')
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

  @ApiOperation({ summary: '지표 리스트를 불러옵니다.' })
  @ApiOkResponse({ type: [IndicatorSwaggerSchema] })
  @ApiExceptionResponse(400, '[ERROR] 지표를 불러오는 도중에 entity 오류가 발생했습니다.') // TODO: 예외 처리해야함
  @ApiExceptionResponse(404, '[ERROR] 지표들를 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.')
  @Get('/indicator')
  async getIndicatorList(): Promise<Indicator[]> {
    const query = new GetIndicatorsQuery();
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: 'History 지표를 불러옵니다.' })
  @ApiPaginatedResponseDecorator(IndicatorValueSwaggerSchema)
  @ApiExceptionResponse(
    404,
    '[ERROR] 지표를 cursor pagination 하는 중에 startDate, endDate에 대한 entity를 찾지 못 했습니다. 올바른 날짜를 입력했는지 확인해주세요.',
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

  @ApiOperation({ summary: '지표보드 메타데이터를 생성합니다.' })
  @ApiCreatedResponse()
  @ApiExceptionResponse(404, '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.')
  @ApiExceptionResponse(
    500,
    `[ERROR] 지표보드 메타데이터를 생성하는 도중에 오류가 발생했습니다. 다음과 같은 상황을 확인해보세요.
          1. indicatorBoardMetaData 값 중 비어있는 값이 있는지 확인해주세요.`,
  )
  @UseGuards(AuthGuard)
  @Post('/indicator-board-metadata')
  async createIndicatorBoardMetadata(
    @Body() createIndicatorBoardMetadataDto: CreateIndicatorBoardMetadataDto,
    @Res() res: Response,
    @Member() member: MemberEntity,
  ) {
    const command = new CreateIndicatorBoardMetadataCommand(
      createIndicatorBoardMetadataDto.indicatorBoardMetadataName,
      member.id,
    );
    await this.commandBus.execute(command);
    res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({ summary: '지표보드 메타데이터 id로 메타데이터를 가져옵니다.' })
  @ApiOkResponse({ type: IndicatorBoardMetadata })
  @ApiExceptionResponse(
    400,
    `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(404, '[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.')
  @ApiParam({
    name: 'id',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Get('/indicator-board-metadata/:id')
  async getIndicatorBoardMetadataById(@Param('id') id): Promise<IndicatorBoardMetadata> {
    const query = new GetIndicatorBoardMetadataQuery(id);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '특정 사용자의 member id로 메타데이터 리스트를 가져옵니다.' })
  @ApiOkResponse({ type: [IndicatorBoardMetadata] })
  @ApiExceptionResponse(
    400,
    '[ERROR] 메타데이터 리스트를 불러오는 중 오류가 발생했습니다. member id값이 number인지 확인하세요.',
  )
  @ApiExceptionResponse(404, '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.')
  @Get('/indicator-board-metadata')
  async getIndicatorBoardMetadataListByMember(@Member() member: MemberEntity): Promise<IndicatorBoardMetadata[]> {
    const query = new GetIndicatorBoardMetadataListQuery(member.id);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 id를 추가합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(400, '[ERROR] 지표보드 메타데이터를 업데이트하는 도중에 entity 오류가 발생했습니다.')
  @ApiExceptionResponse(
    404,
    '[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetaData.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(500, '[ERROR] 새로운 지표를 추가하는 중에 예상치 못한 문제가 발생했습니다.')
  @ApiParam({
    name: 'id',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Post('/indicator-board-metadata/:id')
  async insertNewIndicatorId(@Param('id') indicatorBoardMetadataId, @Body() insertIndicatorDto: InsertIndicatorDto) {
    const command = new InsertIndicatorIdCommand(indicatorBoardMetadataId, insertIndicatorDto.indicatorId);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 id를 삭제합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    `[ERROR] 지표보드 메타데이터 지표 id를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetaData.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(500, '[ERROR] 지표 id를 삭제하는 중에 예상치 못한 문제가 발생했습니다.')
  @ApiParam({
    name: 'indicatorBoardMetadataId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiParam({
    name: 'indicatorId',
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    required: true,
  })
  @Delete('/indicator-board-metadata/:indicatorBoardMetadataId/indicator/:indicatorId')
  async deleteIndicatorId(
    @Param('indicatorBoardMetadataId') indicatorBoardMetadataId,
    @Param('indicatorId') indicatorId,
  ): Promise<void> {
    const command = new DeleteIndicatorIdCommand(indicatorBoardMetadataId, indicatorId);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터를 삭제합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    `[ERROR] 지표보드 메타데이터를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(404, '[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] 지표보드 메타데이터를 삭제하는 도중에 예상치 못한 문제가 발생했습니다.')
  @ApiParam({
    name: 'id',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Delete('/indicator-board-metadata/:id')
  async deleteIndicatorBoardMetadata(@Param('id') id) {
    const command = new DeleteIndicatorBoardMetadataCommand(id);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터의 이름을 수정합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    `[ERROR] 지표보드 메타데이터의 이름을 수정하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(404, '[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.')
  @ApiExceptionResponse(500, '[ERROR] 지표보드 메타데이터의 이름을 수정하는 중에 예상치 못한 문제가 발생했습니다.')
  @ApiParam({
    name: 'id',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Patch('/indicator-board-metadata/:id')
  async updateIndicatorBoardMetadataName(
    @Param('id') id,
    @Body() updateIndicatorBoardMetadataNameDto: UpdateIndicatorBoardMetadataNameDto,
  ) {
    const command = new UpdateIndicatorBoardMetadataNameCommand(id, updateIndicatorBoardMetadataNameDto.name);

    await this.commandBus.execute(command);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: '예측지표를 생성합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(400, '[ERROR] 예측지표의 이름은 비워둘 수 없습니다.')
  @ApiExceptionResponse(404, '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.')
  @ApiExceptionResponse(500, `[ERROR] 예측지표를 생성하는 중 예상치 못한 문제가 발생했습니다.`)
  @Post('/custom-forecast-indicator')
  async createCustomForecastIndicator(
    @Body() createCustomForecastIndicatorDto: CreateCustomForecatIndicatorDto,
    @Res() res: Response,
    @Member() member: MemberEntity,
  ) {
    const command = new CreateCustomForecastIndicatorCommand(
      createCustomForecastIndicatorDto.customForecastIndicatorName,
      createCustomForecastIndicatorDto.targetIndicatorId,
      member.id,
    );
    await this.commandBus.execute(command);
    res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({ summary: '예측지표 id로 예측지표를 불러옵니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(400, '[ERROR] 해당 예측지표를 찾을 수 없습니다.')
  @ApiExceptionResponse(404, '[ERROR] 해당 예측지표를 찾을 수 없습니다.')
  @ApiExceptionResponse(500, `[ERROR] 예측지표를 불러오는 중 예상치 못한 문제가 발생했습니다.`)
  @Get('/custom-forecast-indicator/:customForecastIndicatorId')
  async loadCustomForecastIndicator(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
  ): Promise<CustomForecastIndicator> {
    const query = new GetCustomForecastIndicatorQuery(customForecastIndicatorId);
    return await this.queryBus.execute(query);
  }
}
