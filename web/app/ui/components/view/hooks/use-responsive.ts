import { useCallback, useEffect, useRef, useState } from 'react';

export function useResponsive() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [sizes, setSizes] = useState<{
    containerWidth: number;
    containerHeight: number;
  }>({
    containerWidth: -1,
    containerHeight: -1,
  });

  const setContainerSize = useCallback((newWidth: number, newHeight: number) => {
    setSizes((prevState) => {
      const roundedWidth = Math.round(newWidth);
      const roundedHeight = Math.round(newHeight);
      if (prevState.containerWidth === roundedWidth && prevState.containerHeight === roundedHeight) {
        return prevState;
      }

      return { containerWidth: roundedWidth, containerHeight: roundedHeight };
    });
  }, []);

  useEffect(() => {
    let callback = (entries: ResizeObserverEntry[]) => {
      const { width: containerWidth, height: containerHeight } = entries[0].contentRect;
      setContainerSize(containerWidth, containerHeight);
    };

    const observer = new ResizeObserver(callback);

    if (!containerRef.current) {
      return;
    }

    const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect();
    setContainerSize(containerWidth, containerHeight);

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [setContainerSize]);

  return {
    containerRef,
    sizes,
  };
}
