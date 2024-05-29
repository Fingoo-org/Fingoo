import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import SourceIndicatorSlider, { SourceIndicatorInfo } from './source-indicator-slider';

export default function SourceIndicatorSliderGroup() {
  const { sourceIndicatorList, updateSourceIndicatorWeight, deleteSourceIndicator } =
    useSelectedCustomForecastIndicatorViewModel();

  const handleWeightChange = (item: SourceIndicatorInfo, value: number) => {
    updateSourceIndicatorWeight(item.id, value);
  };

  const handleSourceIndicatorDelete = (item: SourceIndicatorInfo) => {
    deleteSourceIndicator(item.id);
  };

  return (
    <div className="flex flex-col space-y-1">
      {sourceIndicatorList
        ? sourceIndicatorList.map((sourceIndicator) => {
            return (
              <SourceIndicatorSlider
                onSourceIndicatorDelete={handleSourceIndicatorDelete}
                onWeightChange={handleWeightChange}
                key={sourceIndicator.id}
                item={sourceIndicator}
              />
            );
          })
        : null}
    </div>
  );
}
