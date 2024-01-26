import React from 'react';
import List from '../view/atom/list';
import ListItem from '../view/atom/list-item';
import { useIndicatorMetadataList } from '@/app/hooks/use-indicator-metadata-list.hook';

interface MetadataListProps {
  // Define the props for the MetadataList component here
}

export function MetadataList(props: MetadataListProps) {
  const { metadataList } = useIndicatorMetadataList();
  return (
    <div>
      {metadataList && <List list={metadataList} render={(item) => <ListItem key={item.id} content={item.name} />} />}
    </div>
  );
}
