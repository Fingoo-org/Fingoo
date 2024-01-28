import { ListChildComponentProps } from 'react-window';
import WindowList from '../view/molocule/window-list';
import ListItem from '../view/atom/list-item';

export default function IndicatorList() {
  const render = ({ index, style }: ListChildComponentProps) => (
    <ListItem style={style} content={`row${index}`} selected={true} />
  );

  const item = [1];
  item.length = 1000;
  item.fill(5);

  return (
    <>
      <WindowList height={200} items={item} renderRow={render} />
    </>
  );
}
