import * as React from 'react';
import { EmblaOptionsType, EmblaPluginType, EmblaCarouselType } from 'embla-carousel';
import useEmblaCarousel, { EmblaViewportRefType, UseEmblaCarouselType } from 'embla-carousel-react';
import { cn } from '@/app/utils/style';

interface CarouselProps {
  options?: EmblaOptionsType;
  plugins?: EmblaPluginType | EmblaPluginType[];
  axis?: 'x' | 'y';
  setApi?: (api: EmblaCarouselType) => void;
  showPrevNextButtons?: boolean;
  showDotButtons?: boolean;
}

interface CarouselContextProps extends CarouselProps {
  carouselRef: EmblaViewportRefType;
  api: ReturnType<typeof useEmblaCarousel>[1];
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error('Error: used within a <Carousel />');
  }

  return context;
}

const Carousel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
  (
    {
      options,
      plugins = [],
      axis = 'x',
      setApi,
      showPrevNextButtons = false,
      showDotButtons = true,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, carouselApi] = useEmblaCarousel(
      {
        ...options,
        axis,
      },
      Array.isArray(plugins) ? plugins : [plugins],
    );

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

    const onDotButtonClick = React.useCallback(
      (index: number) => {
        if (!carouselApi) return;
        carouselApi.scrollTo(index);
      },
      [carouselApi],
    );

    const onInit = React.useCallback(() => {
      if (!carouselApi) return;
      setScrollSnaps(carouselApi.scrollSnapList());
    }, [carouselApi]);

    const onSelect = React.useCallback(() => {
      if (!carouselApi) return;
      setSelectedIndex(carouselApi.selectedScrollSnap());
    }, [carouselApi]);

    React.useEffect(() => {
      if (!carouselApi) return;
      onInit();
      onSelect();
      carouselApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect);
    }, [carouselApi, onInit, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: carouselApi,
          options,
          axis,
          scrollSnaps,
          selectedIndex,
          onDotButtonClick,
        }}
      >
        <div ref={ref} className={cn('relative', className)} {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, axis } = useCarousel();
    return (
      <div ref={carouselRef} className="overflow-hidden">
        <div ref={ref} className={cn('flex', axis === 'x' ? '-ml-4' : '-mt-4 flex-col', className)} {...props} />
      </div>
    );
  },
);
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { axis } = useCarousel();

    return (
      <div
        ref={ref}
        className={cn('min-w-0 shrink-0 grow-0 basis-full', axis === 'x' ? 'pl-4' : 'pt-4', className)}
        {...props}
      />
    );
  },
);
CarouselItem.displayName = 'CarouselItem';

const CarouselDotButton = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useCarousel();

    return (
      <div className="mt-2 flex justify-center space-x-3">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            ref={ref}
            type="button"
            className={cn(' h-1 w-6', selectedIndex === index ? 'bg-[#6CCABF]' : 'bg-gray-300', className)}
            onClick={() => onDotButtonClick(index)}
            {...props}
          />
        ))}
      </div>
    );
  },
);
CarouselDotButton.displayName = 'CarouselDotButton';

export { Carousel, CarouselContent, CarouselItem, CarouselDotButton };
