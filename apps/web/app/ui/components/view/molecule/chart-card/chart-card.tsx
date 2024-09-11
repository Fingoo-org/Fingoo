import * as React from 'react';
import { cn } from '@/app/utils/style';
import { Card, CardHeader, CardTitle, CardContent } from '../card/card';
import Avatar from '../../atom/avatar/avatar';

interface ChartCardProps {
  indexName: string;
  value: number;
  changeValue: number;
  countryFlag: string;
  chart: React.ReactNode;
}

interface IndexProps {
  data: ChartCardProps[];
}

const ValueDisplay: React.FC<{ value: number }> = ({ value }) => (
  <div className="text-lg font-bold">
    {value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
  </div>
);

const ChangeDisplay: React.FC<{ changeValue: number }> = ({ changeValue }) => (
  <div className="text-sm">{`${changeValue > 0 ? '+' : ''}${changeValue.toFixed(2)}%`}</div>
);

const ChartImage: React.FC<{ chart: string | React.ReactNode }> = ({ chart }) => (
  <div className="h-12 w-full">{chart}</div>
);

const ChartCard: React.FC<ChartCardProps> = ({ indexName, value, changeValue, countryFlag, chart }) => {
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
          <ChartImage chart={chart} />
        </div>
      </CardContent>
    </Card>
  );
};

const ChartCardGrid: React.FC<IndexProps> = ({ data }) => (
  <div className="grid grid-cols-2">
    {data.map((item, index) => (
      <ChartCard
        key={index}
        indexName={item.indexName}
        value={item.value}
        changeValue={item.changeValue}
        countryFlag={item.countryFlag}
        chart={item.chart}
      />
    ))}
  </div>
);

export default ChartCardGrid;
