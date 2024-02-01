import { useFetchIndicatorList } from '../api/query/numerical-guidance.query';

export const useIndicatorList = () => {
  const { data } = useFetchIndicatorList();

  return {
    indicatorList: data?.indicatorList,
  };
};
