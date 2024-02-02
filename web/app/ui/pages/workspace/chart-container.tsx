import { Card } from '@tremor/react';
import IndicatorsChart from '../../components/numerical-guidance/indicators-chart';
export default function ChartContainer() {
  return (
    <Card className="w-[47.5rem] h-[27.5rem] bg-white shadow-lg rounded-lg" decoration="top">
      <IndicatorsChart />
    </Card>
  );
}
