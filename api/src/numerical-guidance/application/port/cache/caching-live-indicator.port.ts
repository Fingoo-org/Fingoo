import { LiveIndicatorDtoType } from '../../../../utils/type/type-definition';

export interface CachingLiveIndicatorPort {
  cachingLiveIndicator(key: string, liveIndicatorDto: LiveIndicatorDtoType): Promise<void>;
}
