import { useFetchPostList } from '@/app/store/querys/post-list.query';
import { useMemo } from 'react';
import { convertPostViewModel } from '../../services/post/view-model/post-view-model.service';

export const usePostList = () => {
  const { data: communityList, setSize } = useFetchPostList();
  const convertedCommunityList = useMemo(() => {
    if (!communityList) return undefined;
    return communityList
      .map((communityList) => {
        return convertPostViewModel(communityList.data);
      })
      .flat();
  }, [communityList]);
  const loadMoreIndicators = () => {
    setSize((size) => size + 1);
  };
  return {
    indicatorList: convertedCommunityList,
    loadMoreIndicators,
  };
};
