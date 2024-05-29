import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import SelectableItem from '../../../../view/atom/selectable-item';
import ListItem from '../../../../view/atom/list-item';
import { useDialog } from '../../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import IconButton from '../../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { cn } from '@/app/utils/style';

type IndicatorListItemProps = {
  item: Indicator;
  style?: React.CSSProperties; // for react-window
};

export default function IndicatorListItem({ item, style }: IndicatorListItemProps) {
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(DIALOG_KEY.INDICATOR_EDIT_MENU);
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
    openDialogWithPayload(item);
  };

  const hoverRender = () => {
    return (
      <IconButton
        aria-label="edit"
        ref={iconButtonRef}
        onClick={handleIconButton}
        icon={DotsHorizontalIcon}
        color={'emerald'}
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
