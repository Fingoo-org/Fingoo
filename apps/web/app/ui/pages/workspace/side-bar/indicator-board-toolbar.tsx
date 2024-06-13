'use client';
import Tabs from '../../../components/view/molecule/tabs';
import IndicatorListContainer from './indicator-list-container';
import CustomForecastIndicatorListContainer from './custom-forecast-indicator-list-container';
import { useWorkspace } from '@/app/business/hooks/use-workspace.hook';

export default function IndicatorBoardToolbar() {
  const { tabIndex, setTabIndex } = useWorkspace();

  const handleTabValueChange = (value: string) => {
    setTabIndex(value);
  };

  return (
    <div>
      <Tabs className="w-full mt-10" value={tabIndex} onValueChange={handleTabValueChange}>
        <Tabs.List className="grid h-10 w-full grid-cols-2">
          <Tabs.Trigger value="0">지표 추가</Tabs.Trigger>
          <Tabs.Trigger value="1">예측 지표</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="0">
          <IndicatorListContainer />
        </Tabs.Content>
        <Tabs.Content value="1">
          <CustomForecastIndicatorListContainer />
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
