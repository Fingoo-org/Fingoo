import { Body, Controller, Get, HttpStatus, Post, Query, Res } from '@nestjs/common';
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

@ApiTags('NumericalGuidanceController')
@Controller('/numerical-guidance')
export class NumericalGuidanceController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '변동지표를 불러옵니다.' })
  @Get('/fluctuatingIndicator')
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

  @Get('/get-indicator-list')
  async getIndicatorList(): Promise<IndicatorListDto> {
    const query = new GetIndicatorListQuery();
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표보드 메타데이터를 생성합니다.' })
  @Post('/indicatorBoardMetaData')
  async createIndicatorBoardMetaData(
    @Body() createIndicatorBoardMetaDataDto: CreateIndicatorBoardMetadataDto,
    @Res() res: Response,
  ) {
    const command = new CreateIndicatorBoardMetadataCommand(
      createIndicatorBoardMetaDataDto.indicatorBoardMetaDataName,
      createIndicatorBoardMetaDataDto.indicatorIds,
      createIndicatorBoardMetaDataDto.memberId,
    );
    await this.commandBus.execute(command);
    res.status(HttpStatus.CREATED).send();
  }
}
