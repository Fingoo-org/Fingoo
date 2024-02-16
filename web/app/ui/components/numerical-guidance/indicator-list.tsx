import { ListChildComponentProps } from 'react-window';
import WindowList from '../view/molocule/window-list';
import SelectableListItem from '../view/atom/selectable-list-item';
import { useIndicatorList } from '@/app/business/hooks/use-indicator-list.hook';
import { IndicatorResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import React from 'react';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import clsx from 'clsx';
import IndicatorListItem from './atom/indicator-list-item';

const IndicatorList = React.memo(function IndicatorList() {
  const { indicatorList } = useIndicatorList();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorResponse[]>) => {
    const indicator = data[index];

    return <IndicatorListItem item={indicator} style={style} />;
  };

  return (
    <div role="tablist" className={clsx({ hidden: selectedMetadata === undefined })}>
      <WindowList height={200} itemHeight={48} items={indicatorList || []} renderRow={render} />
    </div>
  );
});

export default IndicatorList;
