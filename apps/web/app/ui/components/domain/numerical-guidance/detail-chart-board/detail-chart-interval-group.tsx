import { useDetailBoardStore } from '@/app/store/stores/numerical-guidance/detail-board.store';
import { BaseIntervalToggleGroup } from '../indicator/base-interval-toggle-group';

export default function DetailChartIntervalGroup() {
  const { interval } = useDetailBoardStore();
  const { setInterval } = useDetailBoardStore((state) => state.actions);

  return <BaseIntervalToggleGroup interval={interval} setInterval={setInterval} />;
}
