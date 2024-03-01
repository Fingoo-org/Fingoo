import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import Badge from '../../view/atom/badge/badge';
import IconButton from '../../view/atom/icons/icon-button';
import { XCircleIcon } from '@heroicons/react/solid';

export default function SourceIndicatorBadgeGroup() {
  const { sourceIndicatorList } = useSelectedCustomForecastIndicatorViewModel();

  return (
    <div className="flex flex-wrap space-x-2">
      {sourceIndicatorList?.map((sourceIndicator) => {
        const handleClick = () => {
          // logic: 재료 지표 삭제
          console.log('handleClick');
        };
        return (
          <Badge className="pr-0.5" variant={'outline'} key={sourceIndicator.id}>
            {sourceIndicator.ticker}
            <IconButton color={'gray'} icon={XCircleIcon} size={'xs'} onClick={handleClick} />
          </Badge>
        );
      })}
    </div>
  );
}
