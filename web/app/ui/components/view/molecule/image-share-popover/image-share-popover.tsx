import Popover from '../popover';
import { Share1Icon } from '@radix-ui/react-icons';
import IconButton from '../../atom/icons/icon-button';
import ClipboardInput from '../clipboard-input/clipboard-input';
import Button from '../../atom/button/button';

type ImageSharePopoverProps = {
  url?: string;
  baseUrl?: string;
  disabled?: boolean;
  onDownloadImage: () => void;
  onPopoverTriggerClick?: () => void;
};

export default function ImageSharePopover({
  url,
  baseUrl = '',
  disabled = false,
  onDownloadImage,
  onPopoverTriggerClick,
  children,
}: React.PropsWithChildren<ImageSharePopoverProps>) {
  const handlePopoverTriggerClick = () => {
    onPopoverTriggerClick?.();
  };
  return (
    <Popover>
      <Popover.Trigger>
        <IconButton disabled={disabled} onClick={handlePopoverTriggerClick} icon={Share1Icon} color={'gray'} />
      </Popover.Trigger>
      <Popover.Content side={'top'} className="w-96">
        <ClipboardInput copyUrl={`${baseUrl}${url}`} />
        <div className="mt-4 flex justify-center">
          <Button onClick={onDownloadImage} size={'lg'} variant={'light'} color={'gray'}>
            Download Image
          </Button>
        </div>
        {children}
      </Popover.Content>
    </Popover>
  );
}
