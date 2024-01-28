import { ListChildComponentProps } from 'react-window';
import WindowList from '../view/molocule/window-list';
import SelectableListItem from '../view/atom/selectable-list-item';

export default function IndicatorList() {
  const render = ({ index, style }: ListChildComponentProps) => (
    <SelectableListItem key={index} style={style} content={`row${index}`} selected={true} />
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
