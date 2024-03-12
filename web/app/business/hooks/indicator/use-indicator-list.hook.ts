import { useFetchIndicatorList } from '../../../store/querys/numerical-guidance/indicator.query';

export const useIndicatorList = () => {
  const { data: indicatorList } = useFetchIndicatorList();

  // console.log(data);

  return {
    indicatorList,
  };
};
