import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import clsx from 'clsx';
import React from 'react';
import List from '../../../view/molocule/list';
import { CustomForecastIndicator } from '@/app/business/services/view-model/custom-forecast-indicator-view-model.service';
import CustomForecastIndicatorListItem from './custom-forecast-indicator-list-item';
import Pending from '../../../view/molocule/pending';

const CustomForecastIndicatorList = React.memo(function CustomForecastIndicatorList() {
  const { customForecastIndicatorList, isPending } = useCustomForecastIndicatorListViewModel();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const renderItem = (item: CustomForecastIndicator) => {
    return <CustomForecastIndicatorListItem key={item.id} item={item} />;
  };

  return (
    <Pending isPending={isPending}>
      <div
        data-testid="custom-forecast-indicator-list"
        role="tablist"
        className={clsx({ hidden: selectedMetadata === undefined })}
      >
        {customForecastIndicatorList ? (
          <List list={customForecastIndicatorList.customForecastIndicatorList} render={renderItem} />
        ) : null}
      </div>
    </Pending>
  );
});

export default CustomForecastIndicatorList;
