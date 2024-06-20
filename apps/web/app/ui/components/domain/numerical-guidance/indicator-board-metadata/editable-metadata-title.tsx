import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import EditableText from '../../../view/atom/editable-text';
import { cn } from '@/app/utils/style';

type EditableMetadataTittleProps = {
  indicatorBoardMetadataId?: string;
  className?: string;
};

export default function EditableMetadataTittle({ indicatorBoardMetadataId, className }: EditableMetadataTittleProps) {
  const { indicatorBoardMetadata, updateIndicatorBoardMetadata } =
    useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const handleMetadataNameChange = (name: string) => {
    updateIndicatorBoardMetadata({
      name,
    });
  };

  return (
    <EditableText
      inputKey={indicatorBoardMetadata?.id}
      onChangeValue={handleMetadataNameChange}
      readonly={indicatorBoardMetadata ? false : true}
      withResetButton={true}
      withDebounce={500}
      className={cn(
        'max-w-40 p-0 text-center text-xl font-medium',
        {
          'focus:text-gray-500': indicatorBoardMetadata,
        },
        className,
      )}
      defaultValue={indicatorBoardMetadata ? indicatorBoardMetadata.name : 'No metadata'}
    />
  );
}
