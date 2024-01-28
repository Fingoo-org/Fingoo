import { useFetchIndicatorList } from '../api/query/numerical-guidance.query';

export const useIndicatorList = () => {
  const { indicatorList } = useFetchIndicatorList();

  return {
    indicatorList,
  };
};
