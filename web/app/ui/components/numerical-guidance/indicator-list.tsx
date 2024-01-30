import { ListChildComponentProps } from 'react-window';
import WindowList from '../view/molocule/window-list';
import SelectableListItem from '../view/atom/selectable-list-item';
import { useIndicatorList } from '@/app/hooks/use-indicator-list.hook';
import { IndicatorResponse } from '@/app/api/query/numerical-guidance.query';
import React from 'react';
import { useSelectedIndicatorBoardMetadata } from '@/app/hooks/use-selected-indicator-board-metadata.hook';

export default React.memo(function IndicatorList() {
  const { indicatorList } = useIndicatorList();
  const { selectedMetadata, addIndicatorToMetadata } = useSelectedIndicatorBoardMetadata();

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorResponse[]>) => {
    const indicator = data[index];
    const isSelected = selectedMetadata?.indicators?.some((i) => i.ticker === indicator.ticker);
    const handleItemSelect = () => addIndicatorToMetadata(indicator);

    return (
      <SelectableListItem
        onSelect={handleItemSelect}
        key={indicator.ticker}
        style={style}
        content={indicator.name}
        selected={isSelected}
      />
    );
  };

  return (
    <>
      <WindowList height={200} items={indicatorList || []} renderRow={render} />
    </>
  );
});
