import { Suspense } from 'react';
import MetadataList from '../../components/numerical-guidance/metadata-list';
import { SWRConfig } from 'swr';

export default function MetadataTabPanel() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <SWRConfig
        value={{
          suspense: true,
        }}
      >
        <MetadataList />;
      </SWRConfig>
    </Suspense>
  );
}
