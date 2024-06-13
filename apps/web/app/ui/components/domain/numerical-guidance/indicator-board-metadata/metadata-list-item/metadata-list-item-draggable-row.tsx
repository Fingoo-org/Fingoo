import { useCustomForecastIndicatorListInMetadata } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-list-in-metadata.hook';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { Item } from '../../../../view/atom/draggable/draggable-item';
import { createIndicatorTitle } from './metadata-list-item-row';

type MetadataListItemDraggableRowProps = {
  indicatorId: string;
  indicatorBoardMetadataId: string;
};

export default function MetadataListItemDraggableRow({
  indicatorId,
  indicatorBoardMetadataId,
}: MetadataListItemDraggableRowProps) {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { customForecastIndicatorListInMetadata } = useCustomForecastIndicatorListInMetadata(
    indicatorBoardMetadata?.id,
  );

  const indicatorInfo = indicatorBoardMetadata?.getIndicatorInfo(indicatorId);
  const customForecastIndicatorInfo =
    customForecastIndicatorListInMetadata?.findCustomForecastIndicatorById(indicatorId);

  const indicatorTitle = createIndicatorTitle(indicatorInfo, customForecastIndicatorInfo);
  return (
    <Item className="flex h-9 items-center rounded-lg bg-white shadow-lg before:mr-2 before:inline-block before:h-4 before:w-1 before:rounded-full before:bg-fingoo-sub">
      {indicatorTitle}
    </Item>
  );
}
