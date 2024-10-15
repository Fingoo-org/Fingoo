import React from 'react';
import { useIndicatorListByType } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-list-by-type.hook';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import IndicatorSelectItem from './indicator-select-item';
import { cn } from '@/app/utils/style';
import { useSearchedIndicatorList } from '@/app/business/hooks/numerical-guidance/indicator/use-searched-indicator-list.hooks';
import Pending from '../../../view/molecule/pending';
import Blank from '@/app/ui/components/view/molecule/blank';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export type IndicatorData = {
  id: string;
  name: string;
  symbol: string;
  exchange: string;
  indicatorType: string;
};

type IndicatorSelectResultProps = {
  mockData?: IndicatorData[];
};

const ITEM_HEIGHT = 70;
const ITEM_MARGIN = 8;

export default function IndicatorSelectResult({ mockData }: IndicatorSelectResultProps) {
  const { searchedIndicatorList, isLoading } = useSearchedIndicatorList();
  const { indicatorList } = useIndicatorListByType();
  const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } = useSelectedIndicatorBoardMetadata();

  const items = mockData || searchedIndicatorList || indicatorList || [];

  const handleSelect = (indicator: IndicatorData) => {
    const isSelected = selectedMetadata?.indicatorIds?.includes(indicator.id) || false;
    if (isSelected) {
      deleteIndicatorFromMetadata(indicator.id);
    } else {
      addIndicatorToMetadata({
        id: indicator.id,
        name: indicator.name,
        symbol: indicator.symbol,
        exchange: indicator.exchange,
        indicatorType: indicator.indicatorType,
      });
    }
  };

  return (
    <div className={cn('h-full overflow-y-auto pt-2')}>
      <Blank isBlank={selectedMetadata === undefined} blankFallback={<div>Loading...</div>}>
        <Pending isPending={isLoading && !mockData}>
          {items.map((indicator) => (
            <div
              key={indicator.id}
              style={{
                height: ITEM_HEIGHT,
                marginBottom: ITEM_MARGIN,
              }}
            >
              <IndicatorSelectItem
                name={indicator.name}
                symbol={indicator.symbol}
                type={`${indicator.exchange} - ${indicator.indicatorType}`}
                isSelected={selectedMetadata?.indicatorIds?.includes(indicator.id) || false}
                onSelect={() => handleSelect(indicator)}
              />
            </div>
          ))}
        </Pending>
      </Blank>
    </div>
  );
}
