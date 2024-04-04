import Popover from '../popover';
import { Share1Icon } from '@radix-ui/react-icons';
import IconButton from '../../atom/icons/icon-button';

export default function ImageSharePopover() {
  return (
    <Popover>
      <Popover.Trigger>
        <IconButton icon={Share1Icon} />
      </Popover.Trigger>
      <Popover.Content className="h-80 w-80">
        <div>asd</div>
      </Popover.Content>
    </Popover>
  );
}
