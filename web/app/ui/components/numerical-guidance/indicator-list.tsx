import { ListChildComponentProps } from 'react-window';
import WindowList from '../view/atom/window-list';

export default function IndicatorList() {
  const render = ({ index, style }: ListChildComponentProps) => <div style={style}>Row {index}</div>;

  const item = [1];
  item.length = 1000;
  item.fill(5);

  return (
    <>
      <WindowList height={200} items={item} renderRow={render} />
    </>
  );
}
