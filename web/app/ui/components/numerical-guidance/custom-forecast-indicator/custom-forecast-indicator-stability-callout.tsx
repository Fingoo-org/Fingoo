import Callout from '../../view/molecule/callout';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

type CustomForecastIndicatorStabilityCalloutProps = {
  indicatorBoardMetadataId?: string;
};

export default function CustomForecastIndicatorStabilityCallout({
  indicatorBoardMetadataId,
}: CustomForecastIndicatorStabilityCalloutProps) {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { customForecastIndicatorList } = useCustomForecastIndicatorListViewModel();

  const customForecastIndicatorInMetadata = indicatorBoardMetadata?.customForecastIndicatorIds.map((id) =>
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
