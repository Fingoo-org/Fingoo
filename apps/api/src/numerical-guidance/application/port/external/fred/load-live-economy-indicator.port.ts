import { IndicatorDtoType, LiveIndicatorDtoType } from '../../../../../utils/type/type-definition';

export interface LoadLiveEconomyIndicatorPort {
  loadLiveIndicator(
    indicatorDto: IndicatorDtoType,
    interval: string,
    startDate: string,
    endDate: string,
  ): Promise<LiveIndicatorDtoType>;
}
