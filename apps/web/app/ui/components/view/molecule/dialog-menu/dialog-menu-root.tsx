'use client';
import React from 'react';
import { Transition } from '@headlessui/react';
import { DialogMenuContext } from './dialog-menu.context';
import { DialogMenuHeader } from './dialog-menu-header';
import { useDialog } from '../../../../../utils/hooks/use-dialog.hook';
import { DialogKey } from '@/app/utils/keys/dialog-key';
import { filterChildrenByType, getViewport } from '@/app/utils/helper';
import { cn, getColorClassNames } from '@/app/utils/style';
import { dialogMenuSize, DialogMenuSize } from './dialog-menu.style';
import { Color } from '@/app/utils/style';
import { Position } from '@/app/store/stores/dialog.store';

type Side = 'top' | 'bottom' | 'right' | 'right-top';

type DialogMenuProps = {
  dialogKey: DialogKey;
  size?: DialogMenuSize;
  color?: Color;
  side?: Side;
  xOffset?: number;
  yOffset?: number;
};

const getDialogMenuHeader = (children: React.ReactNode) => {
  return filterChildrenByType(children, DialogMenuHeader);
};

const getCoordinate = (side: Side, position: Position) => {
  const { viewportHeight } = getViewport();

  switch (side) {
    case 'top':
      return {
        left: position.x,
        bottom: viewportHeight - position.y,
      };
    case 'bottom':
      return {
        left: position.x,
        top: position.y,
      };
    case 'right':
      return {
        left: position.right + 10,
        top: position.y - (viewportHeight - position.y) / 2,
      };
    case 'right-top':
      return {
        left: position.right + 10,
        bottom: viewportHeight - position.y,
      };
  }
};

const addOffset = (
  coordinate: { left?: number; top?: number; bottom?: number; right?: number },
  xOffset: number,
  yOffset: number,
) => {
  return {
    left: coordinate.left ? coordinate.left + xOffset : undefined,
    top: coordinate.top ? coordinate.top + yOffset : undefined,
    bottom: coordinate.bottom ? coordinate.bottom - yOffset : undefined,
    right: coordinate.right ? coordinate.right - xOffset : undefined,
  };
};

export function DialogMenuRoot({
  color = 'white',
  children,
  dialogKey,
  size = 'xs',
  side = 'bottom',
  xOffset = 0,
  yOffset = 0,
}: React.PropsWithChildren<DialogMenuProps>) {
  const { isOpen, position, closeDialog } = useDialog(dialogKey);
  const dialogMenuHeader = getDialogMenuHeader(children);

  const childrenWithoutHeader = React.Children.toArray(children).filter((child) => {
    return !React.isValidElement(child) || (child as React.ReactElement).type !== DialogMenuHeader;
  });

  const dialogSize = dialogMenuSize[size];

  const coordinate = getCoordinate(side, position);
  const coordinateWithOffset = addOffset(coordinate, xOffset, yOffset);

  const handleOnClick = () => {
    closeDialog();
  };

  return (
    <DialogMenuContext.Provider value={dialogKey}>
      <div className="pointer-events-none fixed inset-0	z-50	overflow-hidden">
        <Transition as={React.Fragment} show={isOpen || false}>
          <div className="pointer-events-auto relative z-0">
            <div onClick={handleOnClick} className="fixed left-0 top-0 h-screen w-screen" />
            <div role="dialog" style={coordinateWithOffset} className="fixed">
              <Transition.Child
                as={React.Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <div
                  role="menu"
                  className={cn(
                    'pointer-events-auto relative mt-2 origin-top-left overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 focus:outline-none',
                    dialogSize,
                    getColorClassNames(color, 100).bgColor,
                    'opacity-80',
                  )}
                >
                  {dialogMenuHeader.length !== 0 ? <div className="px-4 pb-1 pt-4">{dialogMenuHeader}</div> : null}
                  {childrenWithoutHeader}
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition>
      </div>
    </DialogMenuContext.Provider>
  );
}
