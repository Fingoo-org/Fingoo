import { useFetchIndicatorList } from '../../store/querys/numerical-guidance/indicator.query';

export const useIndicatorList = () => {
  const { data } = useFetchIndicatorList();

  return {
    indicatorList: data?.indicatorList,
  };
};
