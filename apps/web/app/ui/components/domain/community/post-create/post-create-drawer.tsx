import React from 'react';
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

interface PostCreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export function PostCreateDrawer({ isOpen, onClose }: PostCreateDrawerProps) {
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
        <div className="flex-1 overflow-auto p-4">{/* 게시물 생성 폼 */}</div>
        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
