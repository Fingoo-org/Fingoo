import { FixedSizeList as List, areEqual } from 'react-window';
import { ListChildComponentProps } from 'react-window';

type WindowListProps<T> = {
  height: number;
  items: T[];
  renderRow: ({ index, style }: ListChildComponentProps) => React.ReactElement<RowProps>;
};

type RowProps = {
  style: React.CSSProperties;
};

export default function WindowList<T>({ height, items, renderRow }: WindowListProps<T>) {
  return (
    <List height={height} itemData={items} itemCount={items.length} itemSize={35} width="100%">
      {renderRow}
    </List>
  );
}
