import { FixedSizeList as List, areEqual } from 'react-window';
import { ListChildComponentProps } from 'react-window';
import { useResponsive } from '../hooks/use-responsive';

type WindowListProps<T> = {
  maxVieweditemCount: number;
  items: T[];
  renderRow: ({ index, style }: ListChildComponentProps) => React.ReactElement<RowProps>;
};

type RowProps = {
  style: React.CSSProperties;
};

export default function WindowList<T>({ items, maxVieweditemCount, renderRow }: WindowListProps<T>) {
  const { containerRef, sizes } = useResponsive();

  const itemHeight = Math.floor(sizes.containerHeight / maxVieweditemCount);

  return (
    <div role="tablist" ref={containerRef} className="h-full max-h-full w-full	">
      <List height={sizes.containerHeight} itemData={items} itemCount={items.length} itemSize={itemHeight} width="100%">
        {renderRow}
      </List>
    </div>
  );
}
