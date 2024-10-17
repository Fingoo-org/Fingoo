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
        <div className="relative flex h-[42px] w-[42px] flex-col">
          <Avatar
            src={item.author.profileImageUrl ? item.author.profileImageUrl : '/assets/images/avator_example2.png'}
            variant={'post_circle'}
            className="rounded-full"
          />
          <button className="absolute bottom-0 right-0 z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="#6CCABF"
              className="h-[10px] w-[10px]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
        <div className="flex h-full w-full flex-col pl-2 pt-1">
          <div className="flex h-auto w-full items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2">
              <div className="text-sm font-semibold text-black">{item.author.userName}</div>
              <div className="text-sm text-gray-400">{item.createdAt}</div>
            </div>
            {/* <div className="pb-1 text-gray-500 hover:bg-gray-300">
              <FaEllipsis />
            </div> */}
            <button className="absolute bottom-0 right-0 z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6 text-gray-500"
              >
                <circle cx="5" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="19" cy="12" r="2" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="mt-1 text-sm font-medium text-black">{item.content}</div>
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
                className="flex items-center gap-1 rounded-md px-2 py-1 hover:bg-gray-300"
                onClick={() => (isSelected ? handleItemDeSelect() : handleItemSelect())}
              >
                <Heart size={18} color={item.hasUserLiked ? 'red' : 'gray'} />
                <span className={`text-sm text-gray-500`}>{item.likeCount}</span>
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
