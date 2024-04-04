import { useCallback, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import FileSaver from 'file-saver';

type UseGenerateImage<T extends HTMLElement = HTMLDivElement> = {
  generateImage: () => Promise<string | undefined>;
  downloadImage: () => void;
  isLoading: boolean;
  ref: React.MutableRefObject<T | null>;
};

type UseGenerateImageArgs = {
  imageName: string;
};

export function useGenerateImage<T extends HTMLElement = HTMLDivElement>({
  imageName,
}: UseGenerateImageArgs): UseGenerateImage<T> {
  const ref = useRef<T>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateImage = useCallback(async () => {
    if (ref !== null && ref?.current) {
      setIsLoading(true);

      return await htmlToImage
        .toPng(ref.current as HTMLElement, {
          quality: 0.8,
          backgroundColor: 'white',
        })
        .then((dataUrl) => {
          setIsLoading(false);
          return dataUrl;
        });
    }
  }, []);

  const downloadImage = async () => {
    const png = await generateImage();
    if (png) {
      FileSaver.saveAs(png, `${imageName}.png`);
    }
  };

  return {
    ref,
    isLoading,
    generateImage,
    downloadImage,
  };
}
