import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import Badge from '../../view/atom/badge/badge';

export default function SourceIndicatorBadgeGroup() {
  const { sourceIndicatorList } = useSelectedCustomForecastIndicatorViewModel();

  return (
    <div className="flex flex-wrap space-x-2">
      {sourceIndicatorList?.map((sourceIndicator) => {
        return (
          <Badge variant={'outline'} key={sourceIndicator.id}>
            {sourceIndicator.ticker}
          </Badge>
        );
      })}
    </div>
  );
}
