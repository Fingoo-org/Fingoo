import { useCustomForecastIndicatorListViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import React from 'react';
import List from '../../../../view/molecule/list';
import { CustomForecastIndicator } from '@/app/business/services/numerical-guidance/view-model/custom-forecast-indicator-view-model.service';
import CustomForecastIndicatorListItem from './custom-forecast-indicator-list-item';
import Pending from '../../../../view/molecule/pending';
import { cn } from '@/app/utils/style';
import CustomForecastIndicatorCreateButton from './custom-forecast-indicator-create-button';

const CustomForecastIndicatorList = React.memo(function CustomForecastIndicatorList() {
  const { customForecastIndicatorList, isPending } = useCustomForecastIndicatorListViewModel();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const renderItem = (item: CustomForecastIndicator) => {
    return <CustomForecastIndicatorListItem key={item.id} item={item} />;
  };

  return (
    <Pending isPending={isPending}>
      <div className="flex justify-end py-2 pb-3 pr-2">
        <CustomForecastIndicatorCreateButton />
      </div>
      <div
        data-testid="custom-forecast-indicator-list"
        role="tablist"
        className={cn('h-[26vh] overflow-y-auto scrollbar-thin', { hidden: selectedMetadata === undefined })}
      >
        {customForecastIndicatorList ? (
          <List list={customForecastIndicatorList.customForecastIndicatorList} render={renderItem} />
        ) : null}
      </div>
    </Pending>
  );
});

export default CustomForecastIndicatorList;
