import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCustomForecastIndicatorsByMemberIdQuery } from './get-custom-forecast-indicators-by-member-id.query';
import { LoadCustomForecastIndicatorsByMemberIdPort } from '../../port/persistence/custom-forecast-indicator/load-custom-forecast-indicators-by-member-id.port';
import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

@Injectable()
@QueryHandler(GetCustomForecastIndicatorsByMemberIdQuery)
export class GetCustomForecastIndicatorsByMemberIdQueryHandler implements IQueryHandler {
  constructor(
    @Inject('LoadCustomForecastIndicatorsByMemberIdPort')
    private readonly loadCustomForecastIndicatorsByMemberIdPort: LoadCustomForecastIndicatorsByMemberIdPort,
  ) {}

  async execute(query: GetCustomForecastIndicatorsByMemberIdQuery): Promise<CustomForecastIndicator[]> {
    const memberId = query.memberId;
    const customForecastIndicators: CustomForecastIndicator[] =
      await this.loadCustomForecastIndicatorsByMemberIdPort.loadCustomForecastIndicatorsByMemberId(memberId);

    return customForecastIndicators;
  }
}
