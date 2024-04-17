import Callout from '../../view/molocule/callout';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';

export default function CustomForecastIndicatorStabilityCallout() {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { customForecastIndicatorList } = useCustomForecastIndicatorListViewModel();

  const customForecastIndicatorInMetadata = selectedMetadata?.customForecastIndicatorIds.map((id) =>
    customForecastIndicatorList?.findCustomForecastIndicatorById(id),
  );

  const isStability = customForecastIndicatorInMetadata?.every((customForecastIndicator) => {
    if (!customForecastIndicator) return true;

    return customForecastIndicator.grangerVerification.every((grangerVerification) => {
      return grangerVerification.verification === 'True';
    });
  });

  if (!customForecastIndicatorInMetadata || customForecastIndicatorInMetadata.length === 0) return null;

  return (
    <Callout
      variant={isStability ? 'default' : 'warning'}
      content={
        isStability ? 'All custom forecast indicators are stable' : 'Some custom forecast indicators are not stable'
      }
    />
  );
}
