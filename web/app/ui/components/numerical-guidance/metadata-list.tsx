import React from 'react';
import List from '../view/atom/list';
import ListItem from '../view/atom/list-item';
import { useStore } from '@/app/store';
import { IndicatorBoardMetadata } from '@/app/store/indicator-board-metadata.slice';

interface MetadataListProps {
  // Define the props for the MetadataList component here
}

export function MetadataList(props: MetadataListProps) {
  const metadataList: IndicatorBoardMetadata[] = useStore((state) => state.metadataList);

  return (
    <div>
      <List list={metadataList} render={(item) => <ListItem key={item.id} content={item.name} />} />
    </div>
  );
}
