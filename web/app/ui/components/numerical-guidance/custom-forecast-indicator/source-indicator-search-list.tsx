import WindowList from '../../view/molecule/window-list';
import { ListChildComponentProps } from 'react-window';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import TinyInput from '../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';
import SourceIndicatorSearchListItem from './source-indicator-search-list-item';
import { useState } from 'react';
import { useIndicatorSearchList } from '@/app/business/hooks/indicator/use-indicator-search-list.hooks';
import { useIndicatorListByType } from '@/app/business/hooks/indicator/use-indicator-list-by-type.hook';
import { Indicator } from '@/app/business/services/view-model/indicator-list/indicators/indicator.service';
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
    <div className="flex h-full flex-col">
      <TinyInput onValueChange={handleSearchTermChange} withDebounce={500} icon={SearchIcon} defaultValue="" />
      <IndicatorTypeToggleGroup value={indicatorType} onValueChange={setIndicatorType} size={'narrow'} />
      <div className="flex-1 py-1.5 pl-6">
        <WindowList
          loadMoreItems={loadMoreIndicators}
          maxVieweditemCount={3}
          items={indicatorList || []}
          renderRow={render}
        />
      </div>
    </div>
  );
}
