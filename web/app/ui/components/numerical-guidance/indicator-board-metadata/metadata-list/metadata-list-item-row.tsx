import ListItem from '../../../view/atom/list-item';
import DraggableItem from '../../../view/atom/draggable/draggable-item';
import IndicatorUnitSelector from './indicator-unit-selector';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import IconButton from '../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { MouseEventHandler } from 'react';

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
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const indicatorInfo = indicatorBoardMetadata?.getIndicatorInfo(indicatorId);
  const indicatorText = `${indicatorInfo?.symbol}(${indicatorInfo?.name})`;

  const handleIconButton: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
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
        {activeDragItemId !== indicatorInfo.id ? (
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
            <div className="mr-1">
              <IndicatorUnitSelector
                indicatorBoardMetadataId={indicatorBoardMetadataId}
                indicatorId={indicatorInfo.id}
              />
            </div>
            <IconButton
              aria-label="metadata-item-row-edit-button"
              // ref={iconButtonRef}
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
