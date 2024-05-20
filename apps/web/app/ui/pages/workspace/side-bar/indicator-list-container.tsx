import IndicatorListTypeToggleGroup from '@/app/ui/components/numerical-guidance/indicator/indicator-list/indicator-list-type-toggle-group';
import IndicatorListResult from '@/app/ui/components/numerical-guidance/indicator/indicator-list/indicator-list-result';
import IndicatorSearchBar from '@/app/ui/components/numerical-guidance/indicator/indicator-list/indicator-search-bar';

export default function IndicatorListContainer() {
  return (
    <div className="flex h-full flex-col px-3">
      <div className="mb-2 mt-2">
        <IndicatorSearchBar />
      </div>
      <div className="flex w-full">
        <IndicatorListTypeToggleGroup />
      </div>
      <IndicatorListResult />
    </div>
  );
}
