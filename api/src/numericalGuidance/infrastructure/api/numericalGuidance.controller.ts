import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetFluctuatingIndicatorsQuery } from '../../application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query';
import { FluctuatingIndicatorsDto } from '../../application/query/get-fluctuatingIndicators/fluctuatingIndicators.dto';

@Controller('/numericalGuidance')
export class NumericalGuidanceController {
  constructor(private queryBus: QueryBus) {}

  @Get()
  async getFluctuatingIndicators(): Promise<FluctuatingIndicatorsDto> {
    return this.queryBus.execute(new GetFluctuatingIndicatorsQuery());
  }
}
