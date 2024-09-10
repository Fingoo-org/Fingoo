import * as React from 'react';
import Pending from '../../../view/molecule/pending';
import ChartCardGrid from '../../../view/molecule/chart-card/chart-card';
import { useCountryMajorChartCardWithCountry } from '@/app/business/hooks/mobile/major-chart/use-major-chart-card-view-model.hook';
import { Carousel, CarouselContent, CarouselDotButton, CarouselItem } from '../../../view/atom/carousel/carousel';

export default function MajorChartCard({ country }: { country: string }) {
  const { majorChartsWithCountry, isPending } = useCountryMajorChartCardWithCountry(country);
  return (
    <Carousel>
      <Pending isPending={isPending}>
        <CarouselContent>
          {majorChartsWithCountry.map((group, index) => (
            <CarouselItem key={`carousel-item-${index}`}>
              <ChartCardGrid
                key={`chart-card-grid-${index}`}
                data={group.map((chartData) => ({
                  indexName: chartData.symbolName,
                  value: chartData.symbolPrice,
                  changeValue: chartData.symbolChanges,
                  countryFlag: `/public/assets/images/${chartData.country.toLowerCase()}.svg`,
                  chart: <div className="flex items-center justify-center bg-gray-300">차트</div>,
                }))}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselDotButton />
      </Pending>
    </Carousel>
  );
}
