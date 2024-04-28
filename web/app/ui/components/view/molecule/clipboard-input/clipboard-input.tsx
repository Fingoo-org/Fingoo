import { ClipboardIcon, ClipboardCheckIcon } from '@heroicons/react/solid';
import { useToast } from '../../hooks/use-toast';
import { useState } from 'react';

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
        description: '클립보드에 복사되었습니다',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center">
        <span className="z-10 inline-flex flex-shrink-0 items-center rounded-s-lg border border-gray-300 bg-gray-100 px-2 py-2.5 text-center text-sm font-medium text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-white">
          URL
        </span>
        <div className="relative w-full">
          <input
            id="website-url"
            type="text"
            className="block w-full border border-e-0 border-s-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            value={displayUrl ? displayUrl : copyUrl}
            readOnly
            disabled
          />
        </div>
        <button
          onClick={handleCopyClipBoard}
          className="z-10 inline-flex flex-shrink-0 items-center rounded-e-lg border border-blue-700 bg-blue-700 px-4 py-3 text-center text-sm font-medium text-white hover:border-blue-800 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-600 dark:bg-blue-600 dark:hover:border-blue-700 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          type="button"
        >
          {isCopied ? <ClipboardCheckIcon className="h-4 w-4" /> : <ClipboardIcon className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
