import { useCountryMajorChartCard } from '@/app/business/hooks/mobile/major-chart/use-major-chart-card-view-model.hook';
import Pending from '../../../view/molecule/pending';
import ChartCardGrid from '../../../view/molecule/chart-card/chart-card';

export default function MajorChartCard() {
  const { majorCharts, isPending } = useCountryMajorChartCard();

  return (
    <Pending isPending={isPending}>
      <div>
        {majorCharts && majorCharts.length > 0 ? (
          <ChartCardGrid
            data={majorCharts.map((chartData) => ({
              indexName: chartData.symbolName,
              value: chartData.symbolPrice,
              changeValue: chartData.symbolChanges,
              countryFlag: `@/public/assets/images/${chartData.country.toLowerCase()}.svg`,
              chart: <div className=" flex items-center justify-center bg-gray-300">차트</div>,
            }))}
          />
        ) : null}
      </div>
    </Pending>
  );
}
