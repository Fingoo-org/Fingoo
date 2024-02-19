import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorQuery } from '../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query';
import { FluctuatingIndicatorDto } from '../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorDto } from './dto/get-fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorWithoutCacheDto } from './dto/get-fluctuatingIndicator-without-cache.dto';
import { IndicatorListDto } from 'src/numerical-guidance/application/query/get-indicator-list/indicator-list.dto';
import { GetIndicatorListQuery } from 'src/numerical-guidance/application/query/get-indicator-list/get-indicator-list.query';
import { GetFluctuatingIndicatorWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateIndicatorBoardMetadataDto } from './dto/create-indicator-board-metadata.dto';
import { CreateIndicatorBoardMetadataCommand } from '../application/command/create-indicator-board-metadata/create-indicator-board-metadata.command';
import { Response } from 'express';
import { GetIndicatorBoardMetadataQuery } from '../application/query/get-indicator-board-metadata/get-indicator-board-metadata.query';
import { IndicatorBoardMetadata } from '../domain/indicator-board-metadata';
import { InsertIndicatorTickerCommand } from '../application/command/insert-indicator-ticker/insert-indicator-ticker.command';
import { InsertIndicatorDto } from './dto/insert-indicator.dto';
import { GetUserIndicatorBoardMetadataListQuery } from '../application/query/get-user-indicator-board-metadata-list/get-user-indicator-board-metadata-list.query';
import { DeleteIndicatorTickerCommand } from '../application/command/delete-indicator-ticker/delete-indicator-ticker.command';
import { DeleteIndicatorBoardMetadataCommand } from '../application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command';

@ApiTags('NumericalGuidanceController')
@Controller('/numerical-guidance')
export class NumericalGuidanceController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '변동지표를 불러옵니다.' })
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

  @ApiOperation({ summary: '지표 리스트를 불러옵니다.' })
  @Get('/indicator-list')
  async getIndicatorList(): Promise<IndicatorListDto> {
    const query = new GetIndicatorListQuery();
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표보드 메타데이터를 생성합니다.' })
  @Post('/indicator-board-metadata')
  async createIndicatorBoardMetaData(
    @Body() createIndicatorBoardMetaDataDto: CreateIndicatorBoardMetadataDto,
    @Res() res: Response,
  ) {
    const command = new CreateIndicatorBoardMetadataCommand(
      createIndicatorBoardMetaDataDto.indicatorBoardMetaDataName,
      createIndicatorBoardMetaDataDto.memberId,
    );
    await this.commandBus.execute(command);
    res.status(HttpStatus.CREATED).send();
  }

  @ApiOperation({ summary: '지표보드 메타데이터 id로 메타데이터를 가져옵니다.' })
  @Get('/indicator-board-metadata/:id')
  async getIndicatorBoardMetaDataById(@Param('id') id): Promise<IndicatorBoardMetadata> {
    const query = new GetIndicatorBoardMetadataQuery(id);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '특정 사용자의 member id로 메타데이터 리스트를 가져옵니다.' })
  @Get('/indicator-board-metadata/member/:memberId')
  async getIndicatorBoardMetadataListByMember(@Param('memberId') memberId: number): Promise<IndicatorBoardMetadata[]> {
    const query = new GetUserIndicatorBoardMetadataListQuery(memberId);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 ticker 추가합니다.' })
  @Post('/indicator-board-metadata/:id')
  async insertNewIndicatorTicker(@Param('id') id, @Body() insertIndicatorDto: InsertIndicatorDto) {
    const command = new InsertIndicatorTickerCommand(id, insertIndicatorDto.ticker, insertIndicatorDto.type);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 ticker 삭제합니다.' })
  @Delete('/indicator-board-metadata/:indicatorBoardMetaDataId/indicator/:ticker')
  async deleteIndicatorTicker(@Param('indicatorBoardMetaDataId') indicatorBoardMetaDataId, @Param('ticker') ticker) {
    const command = new DeleteIndicatorTickerCommand(indicatorBoardMetaDataId, ticker);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터를 삭제합니다.' })
  @Delete('/indicator-board-metadata/:id')
  async deleteIndicatorBoardMetadata(@Param('id') id) {
    const command = new DeleteIndicatorBoardMetadataCommand(id);

    await this.commandBus.execute(command);
  }
}
