import IconButton from '../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useDialog } from '../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import ExpandableListItem from '../../../view/molocule/expandable-list-item';
import DraggableContext from '../../../util/draggable-context';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem, { Item } from '../../../view/atom/draggable-item';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useState } from 'react';
import { cn } from '@/app/utils/style';

type MetadataListItemProps = {
  item: IndicatorBoardMetadata;
};

export default function MetadataListItem({ item }: MetadataListItemProps) {
  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_EDIT_MENU);
  const { selectedMetadata, selectMetadataById } = useSelectedIndicatorBoardMetadata();
  const { indicatorBoardMetadata, updateIndicatorIdsWithSessionIds } = useIndicatorBoardMetadataViewModel(item.id);

  const indicatorIdsWithSessionIds = indicatorBoardMetadata?.indicatorIdsWithSessionIds;

  const isSelected = selectedMetadata?.id === item.id;

  const isIndicatorEmpty = indicatorBoardMetadata?.isEmpty;

  const handleSelect = () => {
    selectMetadataById(item.id);
  };

  const handleIconButton = () => {
    openDialogWithPayload(item);
  };

  const handleActiveChange = (activeId: string | null) => {
    setActiveDragItemId(activeId);
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

  const renderDraggableList = (indicatorIdsWithSessionIds: { [draggableContainerId: string]: string[] }) =>
    Object.keys(indicatorIdsWithSessionIds).map((_, index) => (
      <SortableContext
        key={index}
        id={`session${index + 1}`}
        items={indicatorIdsWithSessionIds[`session${index + 1}`]}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {indicatorIdsWithSessionIds[`session${index + 1}`].length > 0 ? (
            indicatorIdsWithSessionIds[`session${index + 1}`].map((indicatorId) => (
              <DraggableItem
                className="flex items-center before:mr-2 before:inline-block before:h-4 before:w-1 before:rounded-full before:bg-blue-400 first:mt-2 last:mb-2"
                active={activeDragItemId === indicatorId}
                key={indicatorId}
                id={indicatorId}
              >
                {indicatorId}
              </DraggableItem>
            ))
          ) : (
            <DraggableItem
              className="border-dotted border-blue-500"
              active={false}
              disabled={true}
              id={`sessionContext${index + 1}`}
            >
              {isIndicatorEmpty ? '지표를 추가해 주세요' : '지표를 드래그 해 주세요'}
            </DraggableItem>
          )}
        </div>
      </SortableContext>
    ));

  return (
    <ExpandableListItem selected={isSelected} onSelect={handleSelect} hoverRender={hoverRender}>
      <ExpandableListItem.Title>
        <div className="py-1 pl-4">{item.name}</div>
      </ExpandableListItem.Title>
      <ExpandableListItem.ExpandedContent>
        <DraggableContext
          onActiveChange={handleActiveChange}
          onValueChange={updateIndicatorIdsWithSessionIds}
          values={indicatorIdsWithSessionIds ?? {}}
          dragOverlayItem={({ children }) => (
            <Item className="flex items-center rounded-lg bg-white shadow-lg before:mr-2 before:inline-block before:h-4 before:w-1 before:rounded-full before:bg-blue-400">
              {children}
            </Item>
          )}
        >
          <div
            className={cn('divide-y-2', {
              'divide-white': isSelected,
              'divide-blue-200': !isSelected,
            })}
          >
            {indicatorIdsWithSessionIds ? renderDraggableList(indicatorIdsWithSessionIds) : null}
          </div>
        </DraggableContext>
      </ExpandableListItem.ExpandedContent>
    </ExpandableListItem>
  );
}
