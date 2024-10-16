import { Post } from '@/app/business/services/post/view-model/post-list/post-view-model.service';
import { usePostList } from '@/app/business/hooks/post/use-post-list.hook';

import Image from 'next/image';
import { ExternalLink, Heart, MessageSquare } from 'lucide-react';
import Avatar from '../../../view/atom/avatar/avatar';
import { PostResponse } from '@/app/store/querys/post/post-list.query';

type PostListItemProps = {
  item: PostResponse;
  style?: React.CSSProperties;
};

export default function PostListItem({ item, style }: PostListItemProps) {
  const { selectedPost, addHeartToPost, removeHeartFromPost } = usePostList();
  const isSelected: boolean = selectedPost?.postId === item.postId;

  const handleItemSelect = () => {
    console.log('isSelected: ', isSelected);
    addHeartToPost(item.postId);
  };
  const handleItemDeSelect = () => {
    console.log('isSelected: ', isSelected);
    removeHeartFromPost(item.postId);
  };

  return (
    <div className="border-b-1 flex w-full justify-center border-b-2 border-gray-400 border-opacity-30 bg-transparent py-4">
      <div className="flex h-auto w-11/12 rounded-lg ">
        <div className="flex w-[42px] flex-col ">
          <Avatar src="/assets/images/avator_example.svg" variant={'large_square'} className="rounded-full" />
        </div>
        <div className="flex h-full w-full flex-col pl-2 pt-1">
          <div className="flex h-auto w-full items-center gap-x-2">
            <div className="text-sm font-semibold text-black">{item.author.userName}</div>
            <div className="text-sm text-gray-400">{item.createdAt}</div>
          </div>
          <div className="mt-1 text-sm text-black">
            안녕하세요. <br />
            주식에 대해서 질문드립니다.
          </div>
          {item.imageUrl && (
            <div className="mt-2 h-auto w-full">
              <Image
                src="/assets/images/chart_example.png"
                alt="포스트 이미지"
                width={300}
                height={190}
                layout="responsive"
                objectFit="contain"
                className="rounded-lg border-2 border-none"
              />
            </div>
          )}
          <div className="mt-1 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="group flex cursor-pointer items-center gap-1"
                onClick={() => (isSelected ? handleItemDeSelect() : handleItemSelect())}
              >
                <Heart size={18} color={isSelected ? 'red' : 'gray'} />
                <span className={`text-sm ${isSelected ? 'text-red-500' : 'text-gray-500'}`}>{item.likeCount}</span>
              </div>
              <div className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-gray-300">
                <MessageSquare size={18} color="gray" />
                <span className="text-sm text-gray-500">{item.commentCount}</span>
              </div>
              <div className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-gray-300">
                <ExternalLink size={18} color="gray" />
                <span className="text-sm text-gray-500">{item.shareCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
