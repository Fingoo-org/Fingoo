'use client';
import React from 'react';
import List from '../view/molocule/list';
import ListItem from '../view/atom/list-item';
import { useIndicatoBoardrMetadataList } from '@/app/hooks/use-indicator-board-metadata-list.hook';
import { IndicatorBoardMetadataResponse } from '@/app/querys/numerical-guidance/indicator-board-metadata.query';
import Button from '../../components/view/atom/button';
import Pending from '../view/molocule/pending';
export default React.memo(function MetadataList() {
  const { metadataList, createAndSelectMetadata, isPending } = useIndicatoBoardrMetadataList();

  const handleClick = () => {
    const metadata = {
      id: Math.random().toString(36),
      name: 'metadata1',
      indicators: [],
    };
    createAndSelectMetadata(metadata);
  };
  const renderItem = (item: IndicatorBoardMetadataResponse) => <ListItem key={item.id}>{item.name}</ListItem>;

  return (
    <Pending isPending={isPending}>
      {metadataList && <List list={metadataList} render={renderItem} />}
      <Button onClick={handleClick}>create</Button>
    </Pending>
  );
});
