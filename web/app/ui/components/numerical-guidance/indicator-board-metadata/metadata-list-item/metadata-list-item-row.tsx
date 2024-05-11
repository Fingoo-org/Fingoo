import ListItem from '../../../view/atom/list-item';
import DraggableItem from '../../../view/atom/draggable/draggable-item';
import IndicatorUnitSelector from './indicator-unit-selector';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import IconButton from '../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { MouseEventHandler } from 'react';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useDialog } from '../../../view/hooks/use-dialog.hook';

type MetadataListItemRowProps = {
  indicatorId: string;
  activeDragItemId: string | null;
  indicatorBoardMetadataId: string;
};

export default function MetadataListItemRow({
  indicatorId,
  activeDragItemId,
  indicatorBoardMetadataId,
}: MetadataListItemRowProps) {
  const { dialogPositionRef, openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_ROW_EDIT_MENU);

  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const indicatorInfo = indicatorBoardMetadata?.getIndicatorInfo(indicatorId);
  const indicatorText = `${indicatorInfo?.symbol}(${indicatorInfo?.name})`;

  const handleIconButton: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    openDialogWithPayload({
      indicatorId: indicatorInfo?.id,
      metadataId: indicatorBoardMetadataId,
    });
  };
  return (
    indicatorInfo && (
      <div className="relative">
        <DraggableItem
          className="flex h-9 items-center before:mr-2 before:inline-block before:h-4 before:w-1 before:rounded-full before:bg-fingoo-sub first:mt-2 last:mb-2"
          active={activeDragItemId === indicatorInfo.id}
          id={indicatorInfo.id}
        >
          <div className="w-40 truncate">{indicatorText}</div>
        </DraggableItem>
        {!activeDragItemId ? (
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
            <div className="mr-1">
              <IndicatorUnitSelector
                indicatorBoardMetadataId={indicatorBoardMetadataId}
                indicatorId={indicatorInfo.id}
              />
            </div>
            <IconButton
              aria-label="metadata-item-row-edit-button"
              ref={dialogPositionRef}
              onClick={handleIconButton}
              icon={DotsHorizontalIcon}
              color={'gray'}
              className=""
              size={'xs'}
            />
          </div>
        ) : null}
      </div>
    )
  );
}
