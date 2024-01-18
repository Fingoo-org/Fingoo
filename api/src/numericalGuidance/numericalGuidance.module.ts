import { Module } from '@nestjs/common';
import { NumericalGuidanceController } from './infrastructure/api/numericalGuidance.controller';
import { GetFluctuatingIndicatorsQueryHandler } from './application/query/get-fluctuatingIndicators/get-fluctuatingIndicators.query.handler';

@Module({
  imports: [NumericalGuidanceController],
  providers: [
    GetFluctuatingIndicatorsQueryHandler,
    // {
    //   provide: 'LoadCachedFluctuatingIndicatorsPort',
    //   useClass:
    // }
  ],
})
export class NumericalGuidanceModule {}
