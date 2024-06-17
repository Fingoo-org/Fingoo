import { SWRConfig } from 'swr';
import MetadataList from '../../../components/domain/numerical-guidance/indicator-board-metadata/metadata-list/metadata-list';
import ClientDataSuspense from '../../../components/util/client-data-suspense';
import ListSkeleton from '@/app/ui/components/view/skeletons';
import MetadataCreateButton from '@/app/ui/components/domain/numerical-guidance/indicator-board-metadata/metadata-list/metadata-create-button';

export default function MetadataListContainer() {
  return (
    <div className="h-full w-full">
      <div className="flex items-center justify-between px-2.5 py-2">
        <h1 className="text-xl font-bold">메타데이터</h1>
        <MetadataCreateButton />
      </div>
      <ClientDataSuspense
        fallback={
          <div className="px-2.5 pt-3">
            <ListSkeleton />
          </div>
        }
      >
        <SWRConfig
          value={{
            suspense: true,
          }}
        >
          <MetadataList />
        </SWRConfig>
      </ClientDataSuspense>
    </div>
  );
}
