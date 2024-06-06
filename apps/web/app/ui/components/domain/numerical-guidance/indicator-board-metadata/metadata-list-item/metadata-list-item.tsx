import IconButton from '../../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { IndicatorBoardMetadata } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useDialog } from '../../../../view/hooks/use-dialog.hook';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import ExpandableListItem from '../../../../view/molecule/expandable-list-item';
import DraggableContext from '../../../../util/draggable-context';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DraggableItem, { Item } from '../../../../view/atom/draggable/draggable-item';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useEffect, useState } from 'react';
import { cn } from '@/app/utils/style';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import MetadataListItemRow from './metadata-list-item-row';
import { useLogger } from '@/app/logging/logging-context';
import { sendGAEvent } from '@next/third-parties/google';

type MetadataListItemProps = {
  item: IndicatorBoardMetadata;
};

// refactoring의 교본으로 삼으면 좋지 않을까...?
export default function MetadataListItem({ item }: MetadataListItemProps) {
  const logger = useLogger();

  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const { dialogPositionRef: iconButtonRef, openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_EDIT_MENU);
  const { selectedMetadata, selectMetadataById } = useSelectedIndicatorBoardMetadata();
  const { indicatorBoardMetadata, updateIndicatorIdsWithsectionIds } = useIndicatorBoardMetadataViewModel(item.id);
  const [indicatorIdsWithSectionIds, setIndicatorIdsWithsectionIds] = useState<{ [key: string]: string[] } | undefined>(
    indicatorBoardMetadata?.indicatorIdsWithSectionIds,
  );

  const { addMetadataToIndicatorBoard, checkMetadataInIndicatorBoard, deleteMetadataFromIndicatorBoard } =
    useIndicatorBoard(item.id);

  useEffect(() => {
    setIndicatorIdsWithsectionIds(indicatorBoardMetadata?.indicatorIdsWithSectionIds);
  }, [indicatorBoardMetadata?.indicatorIdsWithSectionIds]);

  const isSelected = selectedMetadata?.id === item.id;
  const isMetadataInIndicatorBoard = checkMetadataInIndicatorBoard(item.id);

  const isIndicatorEmpty = indicatorBoardMetadata?.isEmpty;

  const handleIndicatorsectionChange = (newValue: { [key: string]: string[] }) => {
    setIndicatorIdsWithsectionIds(newValue);
    updateIndicatorIdsWithsectionIds(newValue);
  };

  const handleSelect = () => {
    logger.track('click_metadata_item', {
      value: item.id,
    });
    const isSuccess = addMetadataToIndicatorBoard(item.id);
    if (isSuccess) {
      selectMetadataById(item.id);
    }
  };

  const handleDeSelect = () => {
    deleteMetadataFromIndicatorBoard(item.id);
    if (isSelected) {
      selectMetadataById(undefined);
    }
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
        color={'emerald'}
        className="mr-5"
      />
    );
  };

  const renderDraggableList = (indicatorIdsWithSectionIds: { [draggableContainerId: string]: string[] }) =>
    Object.keys(indicatorIdsWithSectionIds).map((_, index) => (
      <SortableContext
        key={index}
        id={`section${index + 1}`}
        items={indicatorIdsWithSectionIds[`section${index + 1}`]}
        strategy={verticalListSortingStrategy}
      >
        <div>
          {indicatorIdsWithSectionIds[`section${index + 1}`].length > 0 ? (
            indicatorIdsWithSectionIds[`section${index + 1}`].map((indicatorId) => (
              <MetadataListItemRow
                key={indicatorId}
                indicatorBoardMetadataId={item.id}
                indicatorId={indicatorId}
                activeDragItemId={activeDragItemId}
              />
            ))
          ) : (
            <DraggableItem
              className="border-dotted border-fingoo-main"
              active={false}
              disabled={true}
              id={`sectionContext${index + 1}`}
            >
              {isIndicatorEmpty ? '지표를 추가해 주세요' : '지표를 드래그 해 주세요'}
            </DraggableItem>
          )}
        </div>
      </SortableContext>
    ));

  return (
    <ExpandableListItem
      onDeSelect={handleDeSelect}
      selected={isMetadataInIndicatorBoard}
      onSelect={handleSelect}
      hoverRender={hoverRender}
      data-testid="metadata-list-item"
      className={cn({
        'border-2 border-fingoo-main bg-fingoo-sub text-fingoo-gray-6 shadow-lg': isSelected,
      })}
    >
      <ExpandableListItem.Title>
        <div className="py-1 pl-4">{item.name}</div>
      </ExpandableListItem.Title>
      <ExpandableListItem.ExpandedContent>
        <DraggableContext
          onActiveChange={handleActiveChange}
          onDragOver={setIndicatorIdsWithsectionIds}
          onDragEnd={handleIndicatorsectionChange}
          values={indicatorIdsWithSectionIds ?? {}}
          dragOverlayItem={({ activeId }) => {
            const indicatorInfo = indicatorBoardMetadata?.getIndicatorInfo(activeId);
            const indicatorText = `${indicatorInfo?.symbol}(${indicatorInfo?.name})`;
            return (
              <Item className="flex h-9 items-center rounded-lg bg-white shadow-lg before:mr-2 before:inline-block before:h-4 before:w-1 before:rounded-full before:bg-fingoo-sub">
                {indicatorText}
              </Item>
            );
          }}
        >
          <div
            className={cn('divide-y-2', {
              'divide-white': isSelected,
              'divide-fingoo-sub': !isSelected,
            })}
          >
            {indicatorIdsWithSectionIds ? renderDraggableList(indicatorIdsWithSectionIds) : null}
          </div>
        </DraggableContext>
      </ExpandableListItem.ExpandedContent>
    </ExpandableListItem>
  );
}
