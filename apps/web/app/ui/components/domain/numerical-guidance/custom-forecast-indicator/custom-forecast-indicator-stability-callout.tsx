import Callout from '../../../view/molecule/callout';
import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import { cn } from '@/app/utils/style';

type CustomForecastIndicatorStabilityCalloutProps = {
  indicatorBoardMetadataId?: string;
};

export default function CustomForecastIndicatorStabilityCallout({
  indicatorBoardMetadataId,
}: CustomForecastIndicatorStabilityCalloutProps) {
  const { splitScreen } = useSplitIndicatorBoard();
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { customForecastIndicatorList } = useCustomForecastIndicatorListViewModel();

  const customForecastIndicatorInMetadata = indicatorBoardMetadata?.customForecastIndicatorIds.map((id) =>
    customForecastIndicatorList?.findCustomForecastIndicatorById(id),
  );

  const isStability = customForecastIndicatorInMetadata?.every((customForecastIndicator) => {
    if (!customForecastIndicator) return true;

    return customForecastIndicator.isStability;
  });

  if (!customForecastIndicatorInMetadata || customForecastIndicatorInMetadata.length === 0) return null;

  return (
    <Callout
      className={cn({
        'py-1 text-xs': splitScreen === 'square',
      })}
      variant={isStability ? 'default' : 'warning'}
      content={isStability ? '안정성이 검증된 예측 지표입니다.' : '안정성이 검증되지 않은 예측 지표입니다.'}
    />
  );
}
