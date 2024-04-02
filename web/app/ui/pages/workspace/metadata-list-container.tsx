import { SWRConfig } from 'swr';
import MetadataList from '../../components/numerical-guidance/indicator-board-metadata/metadata-list/metadata-list';
import ClientDataSuspense from '../../components/util/client-data-suspense';

export default function MetadataListContainer() {
  return (
    <ClientDataSuspense fallback={<div>loading...</div>}>
      <SWRConfig
        value={{
          suspense: true,
        }}
      >
        <MetadataList />
      </SWRConfig>
    </ClientDataSuspense>
  );
}
