import { ListChildComponentProps } from 'react-window';
import WindowList from '../view/molocule/window-list';
import SelectableListItem from '../view/atom/selectable-list-item';
import { useIndicatorList } from '@/app/hooks/use-indicator-list.hook';
import { IndicatorResponse } from '@/app/api/query/numerical-guidance.query';
import React from 'react';

export default React.memo(function IndicatorList() {
  const { indicatorList } = useIndicatorList();

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorResponse[]>) => {
    const indicator = data[index];

    return <SelectableListItem key={indicator.ticker} style={style} content={indicator.name} selected={true} />;
  };

  return (
    <>
      <WindowList height={200} items={indicatorList || []} renderRow={render} />
    </>
  );
});
