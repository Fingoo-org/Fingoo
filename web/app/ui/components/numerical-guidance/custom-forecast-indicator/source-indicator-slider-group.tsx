import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import SourceIndicatorSlider from './source-indicator-slider';

export default function SourceIndicatorSliderGroup() {
  const { sourceIndicatorList } = useSelectedCustomForecastIndicatorViewModel();
  return (
    <div className="flex flex-col space-y-1">
      {sourceIndicatorList
        ? sourceIndicatorList.map((sourceIndicator) => {
            return <SourceIndicatorSlider key={sourceIndicator.id} item={sourceIndicator} />;
          })
        : null}
    </div>
  );
}
