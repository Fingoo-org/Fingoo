import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { AuthGuard } from '../../../auth/auth.guard';
import { CreateIndicatorBoardMetadataDto } from './dto/create-indicator-board-metadata.dto';
import { Member } from '../../../auth/get-member.decorator';
import { MemberEntity } from '../../../auth/member.entity';
import { CreateIndicatorBoardMetadataCommand } from '../../application/command/create-indicator-board-metadata/create-indicator-board-metadata.command';
import { IndicatorBoardMetadata } from '../../domain/indicator-board-metadata';
import { GetIndicatorBoardMetadataQuery } from '../../application/query/get-indicator-board-metadata/get-indicator-board-metadata.query';
import { GetIndicatorBoardMetadataListQuery } from '../../application/query/get-indicator-board-metadata-list/get-indicator-board-metadata-list.query';
import { InsertIndicatorDto } from './dto/insert-indicator.dto';
import { InsertIndicatorIdCommand } from '../../application/command/insert-indicator-id/insert-indicator-id.command';
import { InsertCustomForecastIndicatorDto } from '../custom-forecast-indicator/dto/insert-custom-forecast-indicator.dto';
import { InsertCustomForecastIndicatorIdCommand } from '../../application/command/insert-custom-forecast-indicator-id/insert-custom-forecast-indicator-id.command';
import { DeleteIndicatorIdCommand } from '../../application/command/delete-indicator-id/delete-indicator-id.command';
import { DeleteIndicatorBoardMetadataCommand } from '../../application/command/delete-indicator-board-metadata/delete-indicator-board-metadata.command';
import { UpdateIndicatorBoardMetadataNameDto } from './dto/update-indicator-board-metadata-name.dto';
import { UpdateIndicatorBoardMetadataNameCommand } from '../../application/command/update-indicator-board-metadata-name/update-indicator-board-metadata-name.command';
import { DeleteCustomForecastIndicatorIdCommand } from 'src/numerical-guidance/application/command/delete-custom-forecast-indicator-id/delete-custom-forecast-indicator-id.command';

@ApiTags('IndicatorBoardMetadataController')
@Controller('/api/numerical-guidance')
export class IndicatorBoardMetadataController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '지표보드 메타데이터를 생성합니다.' })
  @ApiCreatedResponse({
    description: '지표보드메타데이터 생성 성공 및 메타데이터 id 리턴',
    type: '008628f5-4dbd-4c3b-b793-ca0fa22b3cfa',
  })
  @ApiExceptionResponse(
    400,
    '지표보드 메타데이터의 이름은 비워둘 수 없습니다.',
    '지표보드 메타데이터의 이름은 비워둘 수 없습니다.',
  )
  @ApiExceptionResponse(
    404,
    '회원 정보가 올바른지 확인해주세요.',
    '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 지표보드 메타데이터를 생성하는 도중에 오류가 발생했습니다. 다음과 같은 상황을 확인해보세요.
          1. indicatorBoardMetaData 값 중 비어있는 값이 있는지 확인해주세요.`,
  )
  @UseGuards(AuthGuard)
  @Post('/indicator-board-metadata')
  async createIndicatorBoardMetadata(
    @Body() createIndicatorBoardMetadataDto: CreateIndicatorBoardMetadataDto,
    @Member() member: MemberEntity,
  ): Promise<string> {
    const command = new CreateIndicatorBoardMetadataCommand(
      createIndicatorBoardMetadataDto.indicatorBoardMetadataName,
      member.id,
    );
    return await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터 id로 메타데이터를 가져옵니다.' })
  @ApiOkResponse({ type: IndicatorBoardMetadata })
  @ApiExceptionResponse(
    400,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    `[ERROR] 지표보드 메타데이터를 불러오는 도중에 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
  )
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
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] 메타데이터 리스트를 불러오는 중 오류가 발생했습니다. member id값이 number인지 확인하세요.',
  )
  @ApiExceptionResponse(
    404,
    '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.',
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표를 불러오는 중에 예상치 못한 문제가 발생했습니다.',
  )
  @Get('/indicator-board-metadata')
  async getIndicatorBoardMetadataListByMember(@Member() member: MemberEntity): Promise<IndicatorBoardMetadata[]> {
    const query = new GetIndicatorBoardMetadataListQuery(member.id);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 id를 추가합니다.' })
  @ApiCreatedResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표보드 메타데이터를 업데이트하는 도중에 entity 오류가 발생했습니다.',
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetaData.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 새로운 지표를 추가하는 중에 예상치 못한 문제가 발생했습니다.',
  )
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

  @ApiOperation({ summary: '지표보드 메타데이터에 예측지표 id를 추가합니다.' })
  @ApiCreatedResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표보드 메타데이터를 업데이트하는 도중에 entity 오류가 발생했습니다.',
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetaData.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 새로운 예측지표를 추가하는 중에 예상치 못한 문제가 발생했습니다.',
  )
  @ApiParam({
    name: 'id',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa874',
    required: true,
  })
  @Post('/indicator-board-metadata/custom-forecast-indicator/:id')
  async insertNewCustomForecastIndicatorId(
    @Param('id') indicatorBoardMetadataId,
    @Body() insertCustomForecastIndicatorDto: InsertCustomForecastIndicatorDto,
  ) {
    const command = new InsertCustomForecastIndicatorIdCommand(
      indicatorBoardMetadataId,
      insertCustomForecastIndicatorDto.customForecastIndicatorId,
    );

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터에 지표 id를 삭제합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 지표보드 메타데이터 지표 id를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetaData.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표 id를 삭제하는 중에 예상치 못한 문제가 발생했습니다.',
  )
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

  @ApiOperation({ summary: '지표보드 메타데이터에 예측지표 id를 삭제합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 지표보드 메타데이터 예측지표 id를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] indicatorBoardMetadataId: ${indicatorBoardMetaData.id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측지표 id를 삭제하는 중에 예상치 못한 문제가 발생했습니다.',
  )
  @ApiParam({
    name: 'indicatorBoardMetadataId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: 'c6a99067-27d0-4358-b3d5-e63a64b604c0',
    required: true,
  })
  @Delete('/indicator-board-metadata/:indicatorBoardMetadataId/custom-forecast-indicator/:customForecastIndicatorId')
  async deleteCustomForecastIndicatorId(
    @Param('indicatorBoardMetadataId') indicatorBoardMetadataId,
    @Param('customForecastIndicatorId') customForecastIndicatorId,
  ): Promise<void> {
    const command = new DeleteCustomForecastIndicatorIdCommand(indicatorBoardMetadataId, customForecastIndicatorId);

    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '지표보드 메타데이터를 삭제합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    `[ERROR] 지표보드 메타데이터를 삭제하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표보드 메타데이터를 삭제하는 도중에 예상치 못한 문제가 발생했습니다.',
  )
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
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 지표보드 메타데이터의 이름을 수정하는 도중에 entity 오류가 발생했습니다.
          1. id 값이 uuid 형식을 잘 따르고 있는지 확인해주세요.`,
  )
  @ApiExceptionResponse(
    404,
    '정보를 불러오는 중에 문제가 발생했습니다. 다시 시도해주세요.',
    '[ERROR] indicatorBoardMetadataId: ${id} 해당 지표보드 메타데이터를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 지표보드 메타데이터의 이름을 수정하는 중에 예상치 못한 문제가 발생했습니다.',
  )
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
}
