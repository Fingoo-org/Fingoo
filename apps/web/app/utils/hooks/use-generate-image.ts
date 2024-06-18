import { useCallback, useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import FileSaver from 'file-saver';

type UseGenerateImage<T extends HTMLElement = HTMLDivElement> = {
  generateImageBlob: () => Promise<Blob | null | undefined>;
  downloadImage: () => void;
  generateImageFile: () => Promise<File | undefined>;
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

  const generateImageBlob = useCallback(async () => {
    if (ref !== null && ref?.current) {
      setIsLoading(true);

      return await htmlToImage
        .toBlob(ref.current as HTMLElement, {
          quality: 0.8,
          backgroundColor: 'white',
        })
        .then((blob) => {
          setIsLoading(false);
          return blob;
        });
    }
  }, []);

  const downloadImage = async () => {
    const blob = await generateImageBlob();
    if (blob) {
      FileSaver.saveAs(blob, `${imageName}.png`);
    }
  };

  const generateImageFile = async () => {
    const blob = await generateImageBlob();
    if (blob) {
      return new File([blob], `${imageName}.png`, { type: 'image/png' });
    }
  };

  return {
    ref,
    isLoading,
    generateImageBlob,
    downloadImage,
    generateImageFile,
  };
}
