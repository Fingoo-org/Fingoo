import { ListItem } from '@tremor/react';
import DraggableItem from '../../../view/atom/draggable/draggable-item';
import IndicatorUnitSelector from './indicator-unit-selector';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

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

  return (
    indicatorInfo && (
      <div className="relative">
        <DraggableItem
          className="flex h-9 items-center before:mr-2 before:inline-block before:h-4 before:w-1 before:rounded-full before:bg-fingoo-sub first:mt-2 last:mb-2"
          active={activeDragItemId === indicatorInfo.id}
          id={indicatorInfo.id}
        >
          <ListItem>
            {/* <ListItem hoverRender={hoverRender}> */}
            <div className="w-40 truncate">{indicatorText}</div>
          </ListItem>
        </DraggableItem>
        {activeDragItemId !== indicatorInfo.id ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <IndicatorUnitSelector indicatorBoardMetadataId={indicatorBoardMetadataId} indicatorId={indicatorInfo.id} />
          </div>
        ) : null}
      </div>
    )
  );
}
