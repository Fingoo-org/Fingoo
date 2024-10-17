import React from 'react';
import { ListChildComponentProps } from 'react-window';
import { usePostList } from '@/app/business/hooks/post/use-post-list.hook';

import PostListItem from './post-list-item';
import Pending from '../../../view/molecule/pending';
import WindowList from '../../../view/molecule/window-list';
import { PostResponse } from '@/app/store/querys/post/post-list.query';

export default function PostListResult() {
  const { postList, loadMorePosts, isPending } = usePostList();

  const render = ({ index, style, data }: ListChildComponentProps<PostResponse[]>) => {
    const post = data[index];
    const isLast = index === data.length - 1;

    // 마지막 항목일 때 "Loading..." 메시지를 보여줌
    if (isLast) {
      return (
        <div style={style}>
          <PostListItem item={post} />
          <div className="text-gray-400">Loading...</div>
        </div>
      );
    }
    return <PostListItem item={post} style={style} />;
  };

  return (
    <div className="h-full w-full">
      <Pending isPending={isPending}>
        <WindowList loadMoreItems={loadMorePosts} maxVieweditemCount={10} items={postList || []} renderRow={render} />
      </Pending>
    </div>
  );
}
