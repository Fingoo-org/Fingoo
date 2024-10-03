import * as React from 'react';
import { cn } from '@/app/utils/style';
import { Card, CardHeader, CardTitle, CardContent } from '../card/card';
import Avatar from '../../atom/avatar/avatar';
import MiniChart, { ChartTimeline } from '../../atom/mini-chart/mini-chart';

interface ChartCardProps {
  indexName: string;
  value: number;
  changeValue: number;
  countryFlag: string;
  chartData: ChartTimeline[];
}

interface IndexProps {
  data: ChartCardProps[];
}

const ValueDisplay = ({ value }: { value: number }) => (
  <div className="text-lg font-bold">
    {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </div>
);

const ChangeDisplay = ({ changeValue }: { changeValue: number }) => (
  <div className="text-sm">{`${changeValue > 0 ? '+' : ''}${changeValue.toFixed(2)}%`}</div>
);

const ChartCard = ({ indexName, value, changeValue, countryFlag, chartData }: ChartCardProps) => {
  const isPositive = changeValue > 0;
  return (
    <Card className={'w-full rounded-sm'}>
      <CardHeader className="flex flex-row items-center justify-around">
        <CardTitle>{indexName}</CardTitle>
        <Avatar src={countryFlag} variant="default" />
      </CardHeader>
      <CardContent className={isPositive ? 'text-red-500' : 'text-blue-500'}>
        <div className="flex flex-row justify-between space-x-3">
          <div className="h-full">
            <ValueDisplay value={value} />
            <ChangeDisplay changeValue={changeValue} />
          </div>
          <MiniChart data={chartData} className="h-12 w-14" isPositive={isPositive} />
        </div>
      </CardContent>
    </Card>
  );
};

const ChartCardGrid = ({ data }: IndexProps) => (
  <div className="grid grid-cols-2">
    {data.map((item, index) => (
      <ChartCard
        key={index}
        indexName={item.indexName}
        value={item.value}
        changeValue={item.changeValue}
        countryFlag={item.countryFlag}
        chartData={item.chartData}
      />
    ))}
  </div>
);

export default ChartCardGrid;
