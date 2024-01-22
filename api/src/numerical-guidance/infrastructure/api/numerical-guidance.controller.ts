import { Body, Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorsQuery } from '../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query';
import { FluctuatingIndicatorsDto } from '../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';
import { GetFluctuatingIndicatorsDto } from './dto/get-fluctuatingIndicators.dto';

@Controller('/numerical-guidance')
export class NumericalGuidanceController {
  constructor(private queryBus: QueryBus) {}

  @Get('/fluctuatingIndicators')
  async getFluctuatingIndicators(
    @Body() getFluctuatingIndicatorsDto: GetFluctuatingIndicatorsDto,
  ): Promise<FluctuatingIndicatorsDto> {
    const query = new GetFluctuatingIndicatorsQuery(
      getFluctuatingIndicatorsDto.dataCount,
      getFluctuatingIndicatorsDto.fluctuatingIndicatorInfos,
    );
    return this.queryBus.execute(query);
  }
}
