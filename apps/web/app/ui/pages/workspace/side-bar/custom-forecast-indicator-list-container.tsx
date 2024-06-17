import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../../components/util/client-data-suspense';
import CustomForecastIndicatorList from '../../../components/domain/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-list/custom-forecast-indicator-list';
import ListSkeleton from '@/app/ui/components/view/skeletons';

export default function CustomForecastIndicatorListContainer() {
  return (
    <ClientDataSuspense
      fallback={
        <div className="pt-2">
          <ListSkeleton />
        </div>
      }
    >
      <SWRConfig
        value={{
          suspense: true,
        }}
      >
        <CustomForecastIndicatorList />
      </SWRConfig>
    </ClientDataSuspense>
  );
}
