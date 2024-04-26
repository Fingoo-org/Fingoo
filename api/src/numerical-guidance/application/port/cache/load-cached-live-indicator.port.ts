import { LiveIndicatorDtoType } from '../../../../utils/type/type-definition';

export interface LoadCachedLiveIndicatorPort {
  loadCachedLiveIndicator(key: string): Promise<LiveIndicatorDtoType>;
}
