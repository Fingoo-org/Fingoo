import { useFetchIndicatorList } from '../../../store/querys/numerical-guidance/indicator.query';

export const useIndicatorList = () => {
  const { data: indicatorList } = useFetchIndicatorList();

  return {
    indicatorList,
  };
};
