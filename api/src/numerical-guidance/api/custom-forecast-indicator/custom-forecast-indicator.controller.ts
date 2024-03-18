import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiExceptionResponse } from '../../../utils/exception-filter/api-exception-response.decorator';
import { AuthGuard } from '../../../auth/auth.guard';
import { CreateCustomForecatIndicatorDto } from './dto/create-custom-forecast-indicator.dto';
import { Response } from 'express';
import { Member } from '../../../auth/get-member.decorator';
import { MemberEntity } from '../../../auth/member.entity';
import { CreateCustomForecastIndicatorCommand } from '../../application/command/create-custom-forecast-indicator/create-custom-forecast-indicator.command';
import { CustomForecastIndicator } from '../../domain/custom-forecast-indicator';
import { GetCustomForecastIndicatorQuery } from '../../application/query/get-custom-forecast-indicator/get-custom-forecast-indicator.query';
import { GetCustomForecastIndicatorsByMemberIdQuery } from '../../application/query/get-custom-forecast-indicators-by-member-id/get-custom-forecast-indicators-by-member-id.query';
import { UpdateSourceIndicatorsAndWeightsDto } from './dto/update-source-indicators-and-weights.dto';
import { UpdateSourceIndicatorsAndWeightsCommand } from '../../application/command/update-source-indicators-and-weights/update-source-indicators-and-weights.command';
import { CustomForecastIndicatorValues } from '../../../utils/type/type-definition';
import { GetCustomForecastIndicatorValuesQuery } from '../../application/query/get-custom-forecast-indicator-values/get-custom-forecast-indicator-values.query';

@ApiTags('CustomForecastIndicatorController')
@Controller('/api/numerical-guidance')
export class CustomForecastIndicatorController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus,
  ) {}

  @ApiOperation({ summary: '예측지표를 생성합니다.' })
  @ApiCreatedResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측지표의 이름은 비워둘 수 없습니다.',
  )
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측지표를 생성하는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @UseGuards(AuthGuard)
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
  @ApiOkResponse({ type: CustomForecastIndicator })
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 해당 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측지표를 불러오는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Get('/custom-forecast-indicator/:customForecastIndicatorId')
  async loadCustomForecastIndicator(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
  ): Promise<CustomForecastIndicator> {
    const query = new GetCustomForecastIndicatorQuery(customForecastIndicatorId);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '사용자 id로 예측지표 리스트를 불러옵니다.' })
  @ApiOkResponse({ type: [CustomForecastIndicator] })
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] memberId: ${memberId} 해당 회원을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측지표를 불러오는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @UseGuards(AuthGuard)
  @Get('/custom-forecast-indicator')
  async loadCustomForecastIndicatorsByMemberId(@Member() member: MemberEntity): Promise<CustomForecastIndicator[]> {
    const query = new GetCustomForecastIndicatorsByMemberIdQuery(member.id);
    return await this.queryBus.execute(query);
  }

  @ApiOperation({ summary: '재료지표를 업데이트합니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측지표를 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 재료지표를 업데이트하는 도중에 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Patch('/custom-forecast-indicator/:customForecastIndicatorId')
  async updateSourceIndicatorsAndWeights(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
    @Body() updateSourceIndicatorsAndWeightsDto: UpdateSourceIndicatorsAndWeightsDto,
  ) {
    const command = new UpdateSourceIndicatorsAndWeightsCommand(
      customForecastIndicatorId,
      updateSourceIndicatorsAndWeightsDto.sourceIndicatorIdsAndWeights,
    );
    await this.commandBus.execute(command);
  }

  @ApiOperation({ summary: '예측지표 id로 예측값을 불러옵니다.' })
  @ApiOkResponse()
  @ApiExceptionResponse(
    400,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측값을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    404,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    '[ERROR] 예측값을 찾을 수 없습니다.',
  )
  @ApiExceptionResponse(
    500,
    '서버에 오류가 발생했습니다. 잠시후 다시 시도해주세요.',
    `[ERROR] 예측값을 불러오는 중 예상치 못한 문제가 발생했습니다.`,
  )
  @ApiParam({
    name: 'customForecastIndicatorId',
    example: '998e64d9-472b-44c3-b0c5-66ac04dfa594',
    required: true,
  })
  @Get('/custom-forecast-indicator-view/:customForecastIndicatorId')
  async loadCustomForecastIndicatorValues(
    @Param('customForecastIndicatorId') customForecastIndicatorId,
  ): Promise<CustomForecastIndicatorValues> {
    const query = new GetCustomForecastIndicatorValuesQuery(customForecastIndicatorId);
    return await this.queryBus.execute(query);
  }
}
