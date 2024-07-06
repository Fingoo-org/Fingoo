import { utcFormat } from 'd3-time-format';
import React from 'react';

export const filterChildrenByType = (children: React.ReactNode, elementType: React.ElementType) => {
  const childArray = React.Children.toArray(children);
  return childArray.filter((child) => React.isValidElement(child) && child.type === elementType);
};

export function deepEqual(obj1: any, obj2: any) {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export function createNotDuplicatedName(baseName: string, names: string[]) {
  let newName = baseName;
  let count = 1;

  while (names.includes(newName)) {
    newName = `${baseName}(${count})`;
    count++;
  }

  return newName;
}

export function getViewport() {
  if (typeof window !== 'undefined') {
    return {
      viewportWeight: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  }

  return {
    viewportWeight: 0,
    viewportHeight: 0,
  };
}
