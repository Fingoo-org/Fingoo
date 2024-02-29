import React from 'react';

export const filterChildrenByType = (children: React.ReactNode, elementType: React.ElementType) => {
  const childArray = React.Children.toArray(children);
  return childArray.filter((child) => React.isValidElement(child) && child.type === elementType);
};

export const calculateIsPending = (isValidating: boolean, isMutating: boolean) => {
  return isMutating || (isValidating && !isMutating);
};
