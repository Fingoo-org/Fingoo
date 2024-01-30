'use client';
import React from 'react';
import List from '../view/molocule/list';
import ListItem from '../view/atom/list-item';
import { useIndicatoBoardrMetadataList } from '@/app/hooks/use-indicator-board-metadata-list.hook';
import { IndicatorBoardMetadataResponse } from '@/app/api/query/numerical-guidance.query';
import Button from '../../components/view/atom/button';
export default React.memo(function MetadataList() {
  const { metadataList, createAndSelectMetadata } = useIndicatoBoardrMetadataList();

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
    <div>
      {metadataList && <List list={metadataList} render={renderItem} />}
      <Button onClick={handleClick}>create</Button>
    </div>
  );
});
