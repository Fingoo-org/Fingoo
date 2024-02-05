'use client';
import { Tab } from '@headlessui/react';
import MetadataListContainer from './metadata-list-container';
import IndicatorListContainer from './indicator-list-container';
import { useNumericalGuidanceStore } from '@/app/stores/numerical-guidance.store';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function IndicatorBoardToolbar() {
  const selectedMetadataId = useNumericalGuidanceStore((state) => state.selectedMetadataId);
  return (
    <div className=" bg-red-800">
      <Tab.Group>
        <Tab.List className="flex space-x-1   p-1">
          <ToolbarTab disable={selectedMetadataId ? false : true} tabName="Tool Bar" />
          <ToolbarTab tabName="Meta Data" />
        </Tab.List>
        <Tab.Panels className="md:h-96">
          <Tab.Panel>
            <IndicatorListContainer />
          </Tab.Panel>
          <Tab.Panel>
            <MetadataListContainer />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

type ToolbarTabProps = {
  tabName: string;
  disable?: boolean;
};

function ToolbarTab({ tabName, disable = false }: ToolbarTabProps) {
  return (
    <Tab
      disabled={disable}
      key={tabName}
      className={({ selected }) =>
        classNames(
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
          'disabled:cursor-not-allowed',
        )
      }
    >
      {tabName}
    </Tab>
  );
}
