import { ClipboardIcon, ClipboardCheckIcon } from '@heroicons/react/solid';
import { useToast } from '../../hooks/use-toast';
import { useState } from 'react';
import AchromaticButton from '../../atom/button/achromatic-button';
import { Link2Icon } from '@radix-ui/react-icons';
import TextInput from '../../atom/text-input/text-input';

type ClipboardInputProps = {
  copyUrl: string;
  displayUrl?: string;
};

export default function ClipboardInput({ copyUrl, displayUrl }: ClipboardInputProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(copyUrl);
      toast({
        description: '클립보드에 복사되었습니다',
      });
      setIsCopied(true);
    } catch (e) {
      toast({
        description: '복사에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex w-full space-x-3">
      <TextInput icon={Link2Icon} id="website-url" type="text" value={displayUrl ? displayUrl : copyUrl} readOnly />
      <AchromaticButton onClick={handleCopyClipBoard}>
        {isCopied ? <ClipboardCheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
      </AchromaticButton>
    </div>
  );
}
