'use client';
import { Card } from '@tremor/react';
import IndicatorSearchList from '../ui/components/numerical-guidance/molecule/indicator-search-list';

export default function Page() {
  return (
    <div className="v-screen flex w-screen items-center justify-center">
      <Card className="h-28 w-72 p-1.5">
        <IndicatorSearchList />
      </Card>
    </div>
  );
}
