import * as React from 'react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../../view/atom/drawer/drawer';

import { Share2Icon, CopyIcon, DownloadIcon, Cross1Icon } from '@radix-ui/react-icons';
import IconButton from '../../../view/atom/icons/icon-button';
import IconActionCard from '../../../view/molecule/icon-action-card/icon-action-card';

export function ChartShareDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <IconButton icon={Share2Icon} className="cursor-pointer" color="gray" />
      </DrawerTrigger>
      <DrawerContent className="bg-gray-1">
        <div className="relative mx-auto w-full max-w-sm">
          <DrawerClose asChild>
            <IconButton icon={Cross1Icon} className="absolute right-4 top-4 cursor-pointer" color="black" />
          </DrawerClose>
          <DrawerHeader className="flex items-center justify-center pt-4">
            <DrawerTitle>차트 공유</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-4 p-4 pb-0">
            <IconActionCard
              text="저장하기"
              icon={DownloadIcon}
              iconColor="black"
              onClick={() => console.log('저장하기 클릭')}
            />
            <IconActionCard
              text="커뮤니티에 공유"
              icon={Share2Icon}
              iconColor="black"
              onClick={() => console.log('커뮤니티에 공유 클릭')}
            />
            <IconActionCard text="복사" icon={CopyIcon} iconColor="black" onClick={() => console.log('복사 클릭')} />
          </div>
          <DrawerFooter></DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
