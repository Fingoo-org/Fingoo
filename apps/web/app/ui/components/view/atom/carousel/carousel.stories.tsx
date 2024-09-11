import type { Meta, StoryObj } from '@storybook/react';
import { Carousel, CarouselContent, CarouselItem, CarouselDotButton } from './carousel';
import React from 'react';

const meta = {
  title: 'view/atom/Carousel',
  component: Carousel,
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-red-300">Item 1</div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-green-300">Item 2</div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-blue-300">Item 3</div>
        </CarouselItem>
      </CarouselContent>
      <CarouselDotButton />
    </Carousel>
  ),
};

export const WithoutDotButtons: Story = {
  render: (args) => (
    <Carousel {...args} showDotButtons={false}>
      <CarouselContent>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-red-300">Item 1</div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-green-300">Item 2</div>
        </CarouselItem>
        <CarouselItem>
          <div className="flex h-64 items-center justify-center bg-blue-300">Item 3</div>
        </CarouselItem>
      </CarouselContent>
    </Carousel>
  ),
};
