import IconButton from '../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import ExpandableListItem from '../../../view/molocule/expandable-list-item';
import DraggableContext from '../../../util/draggable-context';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem from '../../../view/atom/draggable-item';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

type MetadataListItemProps = {
  item: IndicatorBoardMetadata;
};

export default function MetadataListItem({ item }: MetadataListItemProps) {
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_EDIT_MENU);
  const { selectedMetadata, selectMetadataById } = useSelectedIndicatorBoardMetadata();
  const { indicatorBoardMetadata, updateIndicatorIdsWithSessionIds } = useIndicatorBoardMetadataViewModel(item.id);

  const indicatorIdsWithSessionIds = indicatorBoardMetadata?.indicatorIdsWithSessionIds;

  const handleSelect = () => {
    selectMetadataById(item.id);
  };

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
        color={'violet'}
        className="mr-5"
      />
    );
  };

  return (
    <ExpandableListItem selected={selectedMetadata?.id === item.id} onSelect={handleSelect} hoverRender={hoverRender}>
      <ExpandableListItem.Title>
        <div className="py-1 pl-4">{item.name}</div>
      </ExpandableListItem.Title>
      <ExpandableListItem.ExpandedContent>
        <DraggableContext onValueChange={updateIndicatorIdsWithSessionIds} values={indicatorIdsWithSessionIds ?? {}}>
          {indicatorIdsWithSessionIds
            ? Object.keys(indicatorIdsWithSessionIds).map((_, index) => (
                <SortableContext
                  key={index}
                  id={`session${index + 1}`}
                  items={indicatorIdsWithSessionIds[`session${index + 1}`]}
                  strategy={verticalListSortingStrategy}
                >
                  {indicatorIdsWithSessionIds[`session${index + 1}`].map((indicatorId) => (
                    <DraggableItem key={indicatorId} id={indicatorId}>
                      {indicatorId}
                    </DraggableItem>
                  ))}
                </SortableContext>
              ))
            : null}
        </DraggableContext>
      </ExpandableListItem.ExpandedContent>
    </ExpandableListItem>
  );
}
