import html2canvas, { Options as HTML2CanvasOptions } from 'html2canvas';
import { useCallback, useRef, useState } from 'react';

export type UseGenerateImageArgs = {
  options?: HTML2CanvasOptions;
  quality?: number;
  type?: string;
};

export type UseGenerateImage<T extends HTMLElement = HTMLDivElement> = [
  () => Promise<string | undefined>,
  {
    isLoading: boolean;
    ref: React.MutableRefObject<T | null>;
  },
];

export function useGenerateImage<T extends HTMLElement = HTMLDivElement>(
  args?: UseGenerateImageArgs,
): UseGenerateImage<T> {
  const ref = useRef<T>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = useCallback(async () => {
    if (ref !== null && ref?.current) {
      setIsLoading(true);

      return await html2canvas(ref.current as HTMLElement, {
        logging: false,
        ...args?.options,
      }).then((canvas) => {
        setIsLoading(false);
        return canvas.toDataURL(args?.type, args?.quality);
      });
    }
  }, [args]);

  return [
    generateImage,
    {
      ref,
      isLoading,
    },
  ];
}
