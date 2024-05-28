import { ListChildComponentProps } from 'react-window';
import SourceIndicatorSearchListItem from './source-indicator-search-list-item';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import DialogIndicatorList from '../indicator/dialog-indicator-list/dialog-indicator-list';

export default function SourceIndicatorSearchList() {
  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];

    return <SourceIndicatorSearchListItem item={indicator} style={style} />;
  };

  return (
    <DialogIndicatorList render={render} />
  );
}
