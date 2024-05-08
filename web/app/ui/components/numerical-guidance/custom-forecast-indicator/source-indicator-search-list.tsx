import WindowList from '../../view/molecule/window-list';
import { ListChildComponentProps } from 'react-window';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import TinyInput from '../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';
import SourceIndicatorSearchListItem from './source-indicator-search-list-item';
import { useState } from 'react';
import { useIndicatorSearchList } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-search-list.hooks';
import { useIndicatorListByType } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-list-by-type.hook';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import IndicatorTypeToggleGroup from '../../view/molecule/indicator-type-toggle-group';

export default function SourceIndicatorSearchList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [indicatorType, setIndicatorType] = useState<IndicatorType>('stocks');
  const { indicatorList, loadMoreIndicators } = useIndicatorListByType({
    indicatorType,
  });

  // const searchedIndicatorList = useIndicatorSearchList(searchTerm);

  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];

    return <SourceIndicatorSearchListItem item={indicator} style={style} />;
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="flex h-full w-full flex-col">
      <TinyInput onValueChange={handleSearchTermChange} withDebounce={500} icon={SearchIcon} defaultValue="" />
      <div className="py-2">
        <IndicatorTypeToggleGroup value={indicatorType} onValueChange={setIndicatorType} size={'narrow'} />
      </div>
      <div className="h-40">
        <WindowList
          loadMoreItems={loadMoreIndicators}
          maxVieweditemCount={4.5}
          items={indicatorList || []}
          renderRow={render}
        />
      </div>
    </div>
  );
}
