import Popover from '../popover';
import { Share1Icon } from '@radix-ui/react-icons';
import IconButton from '../../atom/icons/icon-button';
import ClipboardInput from '../clipboard-input/clipboard-input';
import Button from '../../atom/button/button';

export default function ImageSharePopover() {
  return (
    <Popover>
      <Popover.Trigger>
        <IconButton icon={Share1Icon} color={'gray'} />
      </Popover.Trigger>
      <Popover.Content side={'top'} className="w-80">
        <ClipboardInput copyUrl="test.com" />
        <div className="mt-4 flex justify-center">
          <Button size={'lg'} variant={'light'} color={'gray'}>
            Download Image
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
