import { useIndicatorListByType } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-list-by-type.hook';
import { useSearchedIndicatorList } from '@/app/business/hooks/numerical-guidance/indicator/use-searched-indicator-list.hooks';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import TinyInput from '@/app/ui/components/view/atom/tiny-input/tiny-input';
import IndicatorTypeToggleGroup from '@/app/ui/components/view/molecule/indicator-type-toggle-group';
import WindowList from '@/app/ui/components/view/molecule/window-list';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import { ListChildComponentProps } from 'react-window';

type DialogIndicatorListProps = {
  render: (props: ListChildComponentProps<Indicator[]>) => JSX.Element;
};

export default function DialogIndicatorList({ render }: DialogIndicatorListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [indicatorType, setIndicatorType] = useState<IndicatorType>('stocks');

  const { searchedIndicatorList } = useSearchedIndicatorList({ searchTerm, indicatorType });

  const { indicatorList, loadMoreIndicators } = useIndicatorListByType({
    indicatorType,
  });

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <TinyInput onValueChange={handleSearchTermChange} withDebounce={700} icon={SearchIcon} defaultValue="" />
      <div className="py-2">
        <IndicatorTypeToggleGroup value={indicatorType} onValueChange={setIndicatorType} size={'narrow'} />
      </div>
      <div className="h-28">
        <WindowList
          loadMoreItems={loadMoreIndicators}
          maxVieweditemCount={4.5}
          items={searchedIndicatorList ? searchedIndicatorList : indicatorList || []}
          renderRow={render}
        />
      </div>
    </div>
  );
}
