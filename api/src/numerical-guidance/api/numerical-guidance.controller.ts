import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorQuery } from '../application/query/get-fluctuatingIndicator/get-fluctuatingIndicator.query';
import { FluctuatingIndicatorDto } from '../application/query/get-fluctuatingIndicator/fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorDto } from './dto/get-fluctuatingIndicator.dto';
import { GetFluctuatingIndicatorWithoutCacheDto } from './dto/get-fluctuatingIndicator-without-cache.dto';
import { IndicatorDto } from 'src/numerical-guidance/application/query/get-indicator/indicator.dto';
import { GetIndicatorsQuery } from 'src/numerical-guidance/application/query/get-indicator/get-indicators.query';
import { GetFluctuatingIndicatorWithoutCacheQuery } from 'src/numerical-guidance/application/query/get-fluctuatingIndicator-without-cache/get-fluctuatingIndicator-without-cache.query';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

@ApiTags('NumericalGuidanceController')
@Controller('/api/numerical-guidance')
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

  @ApiOperation({ summary: 'Live 지표를 불러옵니다.' })
  @Get('/indicators/k-stock/live')
  async getLiveIndicator(@Query() getLiveIndicatorDto: GetLiveIndicatorDto): Promise<FluctuatingIndicatorDto> {
    const query = new GetLiveIndicatorQuery(getLiveIndicatorDto.indicatorId, getLiveIndicatorDto.interval);
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
  @Get('/indicator')
  async getIndicatorList(): Promise<IndicatorDto> {
    const query = new GetIndicatorsQuery();
    return this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표보드 메타데이터를 생성합니다.' })
  @UseGuards(AuthGuard)
  @Post('/indicator-board-metadata')
  async createIndicatorBoardMetaData(
    @Body() createIndicatorBoardMetaDataDto: CreateIndicatorBoardMetadataDto,
    @Res() res: Response,
    @Member() member: MemberEntity,
  ) {
    const command = new CreateIndicatorBoardMetadataCommand(
      createIndicatorBoardMetaDataDto.indicatorBoardMetadataName,
      member.id,
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
  @Get('/indicator-board-metadata')
  async getIndicatorBoardMetadataListByMember(@Member() member: MemberEntity): Promise<IndicatorBoardMetadata[]> {
    const query = new GetIndicatorBoardMetadataListQuery(member.id);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 id를 추가합니다.' })
  @Post('/indicator-board-metadata/:id')
  async insertNewIndicatorTicker(
    @Param('id') indicatorBoardMetadataId,
    @Body() insertIndicatorDto: InsertIndicatorDto,
  ) {
    const command = new InsertIndicatorIdCommand(indicatorBoardMetadataId, insertIndicatorDto.indicatorId);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 id를 삭제합니다.' })
  @Delete('/indicator-board-metadata/:indicatorBoardMetaDataId/indicator/:indicatorId')
  async deleteIndicatorTicker(
    @Param('indicatorBoardMetaDataId') indicatorBoardMetaDataId,
    @Param('indicatorId') indicatorId,
  ) {
    const command = new DeleteIndicatorIdCommand(indicatorBoardMetaDataId, indicatorId);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터를 삭제합니다.' })
  @Delete('/indicator-board-metadata/:id')
  async deleteIndicatorBoardMetadata(@Param('id') id) {
    const command = new DeleteIndicatorBoardMetadataCommand(id);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터의 이름을 수정합니다.' })
  @Patch('/indicator-board-metadata/:id')
  async updateIndicatorBoardMetadataName(
    @Param('id') id,
    @Body() updateIndicatorBoardMetadataNameDto: UpdateIndicatorBoardMetadataNameDto,
  ) {
    const command = new UpdateIndicatorBoardMetadataNameCommand(id, updateIndicatorBoardMetadataNameDto.name);

    await this.commandBus.execute(command);
  }
}
