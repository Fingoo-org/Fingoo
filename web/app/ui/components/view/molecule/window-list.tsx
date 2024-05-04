import { FixedSizeList as List, areEqual } from 'react-window';
import { ListChildComponentProps } from 'react-window';
import { useResponsive } from '../hooks/use-responsive';
import InfiniteLoader from 'react-window-infinite-loader';

type WindowListProps<T> = {
  maxVieweditemCount: number;
  items: T[];
  renderRow: ({ index, style }: ListChildComponentProps) => React.ReactElement<RowProps>;
  loadMoreItems?: () => void;
};

type RowProps = {
  style: React.CSSProperties;
};

export default function WindowList<T>({ items, maxVieweditemCount, renderRow, loadMoreItems }: WindowListProps<T>) {
  const { containerRef, sizes } = useResponsive();

  const itemHeight = Math.floor(sizes.containerHeight / maxVieweditemCount);

  return (
    <div role="tablist" ref={containerRef} className="h-full max-h-full w-full	">
      <InfiniteLoader
        isItemLoaded={(index: number) => {
          return index === items.length - 1 ? false : true;
        }}
        itemCount={items.length}
        loadMoreItems={() => {
          loadMoreItems?.();
        }}
        threshold={1}
      >
        {({ onItemsRendered, ref }) => (
          <List
            ref={ref}
            onItemsRendered={onItemsRendered}
            height={sizes.containerHeight}
            itemData={items}
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
            className="scrollbar-thin"
          >
            {renderRow}
          </List>
        )}
      </InfiniteLoader>
    </div>
  );
}

{
  /* <InfiniteLoader
  isItemLoaded={isItemLoaded}
  itemCount={itemCount}
  loadMoreItems={loadMoreItems}
>
  {({ onItemsRendered, ref }) => (
    <FixedSizeList
      itemCount={itemCount}
      onItemsRendered={onItemsRendered}
      ref={ref}
      {...otherListProps}
    />
  )}
</InfiniteLoader> */
}
