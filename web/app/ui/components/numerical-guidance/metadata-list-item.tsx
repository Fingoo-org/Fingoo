import SelectableListItem from '../view/atom/selectable-list-item';
import IconButton from '../view/atom/icon-button/icon-button';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { useDialogMenuStore } from '@/app/store/stores/dialog-menu.store';
import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import { useRef } from 'react';

type MetadataListItemProps = {
  item: IndicatorBoardMetadataResponse;
};

export default function MetadataListItem({ item }: MetadataListItemProps) {
  // Refactor: hook으로 교체 필요-> ref를 hook 안으로 넣어야함
  const iconButtonRef = useRef<HTMLButtonElement>(null);
  const action = useDialogMenuStore((state) => state.action);
  const { selectedMetadata, selectMetadataById } = useSelectedIndicatorBoardMetadata();

  const handleSelect = () => {
    selectMetadataById(item.id);
  };

  const handleIconButton = () => {
    const iconButtonPosition = iconButtonRef.current?.getBoundingClientRect();

    if (!iconButtonPosition) {
      return;
    }

    const newPosition = {
      x: iconButtonPosition.left,
      y: iconButtonPosition.top + iconButtonPosition.height / 2,
    };

    action.setPayload(item);
    action.setPosition(newPosition);
    action.open();
  };

  return (
    <div className="relative w-full group">
      <SelectableListItem key={item.id} selected={selectedMetadata?.id === item.id} onSelect={handleSelect}>
        {item.name}
      </SelectableListItem>
      <div className="absolute invisible right-3 top-2/4 -translate-y-2/4  z-index-1 group-has-[:hover]:visible">
        <IconButton ref={iconButtonRef} onClick={handleIconButton} icon={DotsHorizontalIcon} color={'violet'} />
      </div>
    </div>
  );
}
