import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import SelectableItem from '../../view/atom/selectable-item';
import ToolTip from '../../view/atom/tooltip';
import Icon from '../../view/atom/icons/variant-icon';
import { SparklesIcon } from '@heroicons/react/outline';

type SourceIndicatorSearchListItemProps = {
  item: IndicatorInfoResponse;
  style: React.CSSProperties;
};

export default function SourceIndicatorSearchListItem({ item, style }: SourceIndicatorSearchListItemProps) {
  const { selectedCustomForecastIndicator, addSourceIndicator, deleteSourceIndicator } =
    useSelectedCustomForecastIndicatorViewModel();

  const indicator = item;

  const indicatorDisplayName = `${indicator.ticker}(${indicator.name})`;

  const isTargetIndicator = selectedCustomForecastIndicator?.targetIndicatorId === indicator.id;
  const isSelected = selectedCustomForecastIndicator?.sourceIndicatorIds?.includes(indicator.id) || isTargetIndicator;

  const handleSourceIndicatorAdd = () => {
    addSourceIndicator(indicator.id);
  };

  const handleSourceIndicatorDelete = () => {
    if (isTargetIndicator) return;
    deleteSourceIndicator(indicator.id);
  };

  return (
    <SelectableItem
      selected={isSelected}
      onSelect={handleSourceIndicatorAdd}
      onDeSelect={handleSourceIndicatorDelete}
      style={style}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-xs">{indicatorDisplayName}</span>
        {isTargetIndicator ? (
          <ToolTip message="대상 지표입니다.">
            <Icon size={'xs'} icon={SparklesIcon} />
          </ToolTip>
        ) : null}
      </div>
    </SelectableItem>
  );
}
