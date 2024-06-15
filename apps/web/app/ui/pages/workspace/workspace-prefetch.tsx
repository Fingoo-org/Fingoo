'use client';
import { workspacePagePreFetching } from '@/app/store/querys/prefetching';

workspacePagePreFetching();

export default function WorkspacePrefetch({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}
