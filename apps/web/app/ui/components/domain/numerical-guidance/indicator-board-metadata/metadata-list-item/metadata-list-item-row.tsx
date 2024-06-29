import ListItem from '../../../../view/atom/list-item';
import DraggableItem from '../../../../view/atom/draggable/draggable-item';
import IndicatorUnitSelector from './indicator-unit-selector';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import IconButton from '../../../../view/atom/icons/icon-button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { MouseEventHandler } from 'react';
import { DIALOG_KEY } from '@/app/utils/keys/dialog-key';
import { useDialog } from '../../../../../../utils/hooks/use-dialog.hook';
import { useCustomForecastIndicatorListInMetadata } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-list-in-metadata.hook';
import { CustomForecastIndicator } from '@/app/business/services/numerical-guidance/view-model/custom-forecast-indicator-view-model.service';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';

type MetadataListItemRowProps = {
  indicatorId: string;
  activeDragItemId: string | null;
  indicatorBoardMetadataId: string;
};

export function createIndicatorTitle(
  indicatorInfo: IndicatorInfoResponse | undefined,
  customForecastIndicatorInfo: CustomForecastIndicator | undefined,
) {
  if (indicatorInfo) {
    return `${indicatorInfo.symbol}(${indicatorInfo.name})`;
  }

  if (customForecastIndicatorInfo) {
    return `${customForecastIndicatorInfo.customForecastIndicatorName}`;
  }
}

export default function MetadataListItemRow({
  indicatorId,
  activeDragItemId,
  indicatorBoardMetadataId,
}: MetadataListItemRowProps) {
  const { dialogPositionRef, openDialogWithPayload } = useDialog(DIALOG_KEY.METADATA_ROW_EDIT_MENU);
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { customForecastIndicatorListInMetadata } = useCustomForecastIndicatorListInMetadata(
    indicatorBoardMetadata?.id,
  );

  const indicatorInfo = indicatorBoardMetadata?.getIndicatorInfo(indicatorId);
  const customForecastIndicatorInfo =
    customForecastIndicatorListInMetadata?.findCustomForecastIndicatorById(indicatorId);

  const indicatorTitle = createIndicatorTitle(indicatorInfo, customForecastIndicatorInfo);

  const handleIconButton: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    openDialogWithPayload({
      indicatorId: indicatorInfo?.id,
      metadataId: indicatorBoardMetadataId,
    });
  };
  return (
    indicatorTitle && (
      <div className="relative text-fingoo-gray-6">
        <DraggableItem
          className="flex h-9 items-center before:mr-2 before:inline-block before:h-4 before:w-1 before:rounded-full before:bg-fingoo-sub first:mt-2 last:mb-2"
          active={activeDragItemId === indicatorId}
          id={indicatorId}
        >
          <div className="w-24 truncate">{indicatorTitle}</div>
        </DraggableItem>
        {!activeDragItemId ? (
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
            <div className="mr-1">
              <IndicatorUnitSelector indicatorBoardMetadataId={indicatorBoardMetadataId} indicatorId={indicatorId} />
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
