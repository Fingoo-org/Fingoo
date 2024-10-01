import { useDetailBoardStore, Interval } from '@/app/store/stores/numerical-guidance/detail-board.store';

export const useDetailBoard = () => {
  const interval = useDetailBoardStore((state) => state.interval);
  const { setInterval } = useDetailBoardStore((state) => state.actions);

  const updateInterval = (newInterval: Interval) => {
    setInterval(newInterval);
  };

  return {
    interval,
    updateInterval,
  };
};
