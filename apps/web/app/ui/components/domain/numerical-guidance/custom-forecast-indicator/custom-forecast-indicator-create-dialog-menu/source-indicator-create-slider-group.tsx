import { useCreatingCustomForecastIndicator } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-creating-custom-forecast-indicator.hook';
import SourceIndicatorSlider, { SourceIndicatorInfo } from '../source-indicator-slider';
import Tooltip from '@/app/ui/components/view/atom/tooltip';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

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
      {sourceIndicators.length !== 0 ? (
        <div className="flex items-center py-1 text-xs font-bold">
          <div>3. 가중치를 조정해주세요.</div>
          <Tooltip message="뭐요">
            <QuestionMarkCircledIcon className="ml-1 h-3.5 w-3.5 text-fingoo-gray-6" />
          </Tooltip>
        </div>
      ) : null}
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
