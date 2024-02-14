import React from 'react';

export const filterChildrenByType = (
  children: React.ReactNode,
  elementType: React.ElementType | React.ElementType[],
) => {
  if (!Array.isArray(elementType)) {
    elementType = [elementType];
  }
  const childArray = React.Children.toArray(children);
  // icludes의 type 유연성을 위해 as React.ElementType 추가
  return childArray.filter(
    (child) => React.isValidElement(child) && elementType.includes(child.type as React.ElementType),
  );
};
