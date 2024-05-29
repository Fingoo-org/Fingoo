import { useCreatingCustomForecastIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-creating-custom-forecast-indicator.hook';
import SourceIndicatorSlider, { SourceIndicatorInfo } from '../source-indicator-slider';

export default function SourceIndicatorCreateSliderGroup() {
  const { sourceIndicators, updateSourceIndicatorWeight, deleteSourceIndicator } = useCreatingCustomForecastIndicator();

  const handleSourceIndicatorWeightChange = (item: SourceIndicatorInfo, value: number) => {
    updateSourceIndicatorWeight(item.id, value);
  };

  const handleSourceIndicatorDelete = (item: SourceIndicatorInfo) => {
    deleteSourceIndicator(item.id);
  };

  return (
    <>
      {sourceIndicators.length !== 0 ? <div className="py-1 text-xs font-bold">3. 가중치를 조정해주세요.</div> : null}
      {sourceIndicators.map((sourceIndicator) => {
        return (
          <SourceIndicatorSlider
            item={{
              id: sourceIndicator.sourceIndicatorId,
              ...sourceIndicator,
            }}
            onWeightChange={handleSourceIndicatorWeightChange}
            onSourceIndicatorDelete={handleSourceIndicatorDelete}
          />
        );
      })}
    </>
  );
}
