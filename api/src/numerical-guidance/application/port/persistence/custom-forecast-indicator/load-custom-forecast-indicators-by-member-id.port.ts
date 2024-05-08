import { CustomForecastIndicator } from 'src/numerical-guidance/domain/custom-forecast-indicator';

export interface LoadCustomForecastIndicatorsByMemberIdPort {
  loadCustomForecastIndicatorsByMemberId(memberId: string): Promise<CustomForecastIndicator[]>;
}
