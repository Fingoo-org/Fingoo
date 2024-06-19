import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import SelectableItem from '../../../../view/atom/selectable-item';
import ListItem from '../../../../view/atom/list-item';
import { useDialog } from '../../../../../../utils/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import IconButton from '../../../../view/atom/icons/icon-button';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { cn } from '@/app/utils/style';
import { useChat } from '@/app/business/hooks/linguistic-guidance/use-chat.hook';
import { generateId } from 'ai';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

type IndicatorListItemProps = {
  item: Indicator;
  style?: React.CSSProperties; // for react-window
};

export default function IndicatorListItem({ item, style }: IndicatorListItemProps) {
  const { append } = useChat();

  const { selectedMetadata, addIndicatorToMetadata, deleteIndicatorFromMetadata } = useSelectedIndicatorBoardMetadata();
  const isSelected = selectedMetadata?.indicatorIds?.some((id) => id === item.id) || false;
  const handleItemSelect = () =>
    addIndicatorToMetadata({
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      exchange: item.exchange,
      indicatorType: item.indicatorType,
    });
  const handleItemDeSelect = () => deleteIndicatorFromMetadata(item.id);

  const handleIconButton = () => {
    append({
      id: generateId(),
      content: `${item.symbol}(${item.name})에 대해 설명해줘`,
      role: 'user',
    });
  };

  const hoverRender = () => {
    return (
      <IconButton
        size={'xs'}
        aria-label="question"
        onClick={handleIconButton}
        icon={QuestionMarkCircledIcon}
        color={'emerald'}
        className="rounded-full"
      />
    );
  };
  return (
    <div style={style} className="px-1">
      <div className="flex h-full items-center justify-center">
        <ListItem hoverRender={hoverRender}>
          <SelectableItem
            onSelect={handleItemSelect}
            onDeSelect={handleItemDeSelect}
            key={item.id}
            selected={isSelected}
            className="rounded-lg py-1"
          >
            <div className="mr-9 flex items-center justify-between text-xs">
              <div>{item.symbol}</div>
              <div>{item.exchange}</div>
            </div>
            <div
              className={cn('mr-9 flex items-center justify-between text-[8px] font-normal	text-fingoo-gray-5', {
                'text-white': isSelected,
              })}
            >
              <div className="w-1/2 truncate text-left">{item.name}</div>
              <div>{item.indicatorType}</div>
            </div>
          </SelectableItem>
        </ListItem>
      </div>
    </div>
  );
}
