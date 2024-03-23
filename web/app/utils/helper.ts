import { utcFormat } from 'd3-time-format';
import React from 'react';

const formatTime = utcFormat('%Y-%m-%d');

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

export function caculateNowDate() {
  const now = new Date();
  return formatTime(now);
}
