import * as React from 'react';
import Pending from '../../../../view/molecule/pending';
import ChartCardGrid from '../../../../view/molecule/chart-card/chart-card';
import { Carousel, CarouselContent, CarouselDotButton, CarouselItem } from '../../../../view/atom/carousel/carousel';
import { useCountryMajorIndicatorCardWithCountry } from '@/app/business/hooks/numerical-guidance/major-indicator/use-major-chart-card-view-model.hook';

export default function MajorIndicatorCard({ country }: { country: string }) {
  const { majorChartsWithCountry, isPending } = useCountryMajorIndicatorCardWithCountry(country);
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
                  chartData: chartData.timeline,
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
