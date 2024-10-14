import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '../../../view/atom/drawer/drawer';
import { Cross1Icon } from '@radix-ui/react-icons';
import { cn } from '@/app/utils/style';
import Avatar from '../../../view/atom/avatar/avatar';
import Button from '../../../view/atom/button/button';
import { TextArea } from '../../../view/atom/text-area/text-area';
import IconButton from '../../../view/atom/icons/icon-button';
import { PresentationChartLineIcon, PhotographIcon, CameraIcon } from '@heroicons/react/outline';

interface PostCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userAvatarSrc: string;
}

export function PostCreateDrawer({ isOpen, onClose, userName, userAvatarSrc }: PostCreateDrawerProps) {
  const [postContent, setPostContent] = useState('');
  const maxLength = 400;

  const handleSubmit = () => {
    console.log('게시물 내용:', postContent);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className={cn('fixed inset-0 m-0 flex h-[100vh] max-h-none w-full flex-col rounded-none bg-gray-1 p-0')}
      >
        <DrawerHeader className="relative flex items-center justify-center border-b border-gray-200 py-4">
          <DrawerClose className="absolute left-4" onClick={onClose}>
            <Cross1Icon className="h-6 w-6" />
          </DrawerClose>
          <DrawerTitle className="text-lg font-semibold">새로운 게시물</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-auto p-4">
          <div className="flex">
            <Avatar src={userAvatarSrc} variant="default" className="mr-3 flex-shrink-0" />
            <div className="flex-grow">
              <div className="mb-2 font-semibold">{userName}</div>
              <TextArea
                placeholder="새로운 게시물을 작성해보세요"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                maxLength={maxLength}
                className="mb-2"
                minRows={1}
              />
              <div className="flex space-x-1">
                <IconButton
                  icon={PresentationChartLineIcon}
                  className="cursor-pointer"
                  color="gray"
                  onClick={() => console.log('차트 추가')}
                />
                <IconButton
                  icon={PhotographIcon}
                  className="cursor-pointer"
                  color="gray"
                  onClick={() => console.log('이미지 추가')}
                />
                <IconButton
                  icon={CameraIcon}
                  className="cursor-pointer"
                  color="gray"
                  onClick={() => console.log('카메라 열기')}
                />
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="border-t border-gray-200 p-4">
          <div className="flex flex-col items-end space-y-2">
            <div className="mr-2 w-full text-right text-sm text-gray-500">
              {postContent.length}/{maxLength}자
            </div>
            <Button
              onClick={handleSubmit}
              disabled={postContent.length === 0}
              className="w-20 rounded-full border-none bg-fingoo-main text-white shadow-md shadow-gray-300 hover:bg-fingoo-sub hover:text-white"
              borderRadius="rounded-full"
              size="sm"
            >
              게시
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
