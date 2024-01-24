'use client';
import { Tab } from '@headlessui/react';
import { MetadataList } from '../../components/numerical-guidance/metadata-list';

type ToolbarTabProps = {
  tabName: string;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function ToolbarTab({ tabName }: ToolbarTabProps) {
  return (
    <Tab
      key={tabName}
      className={({ selected }) =>
        classNames(
          'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
          'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          selected ? 'bg-white text-blue-700 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
        )
      }
    >
      {tabName}
    </Tab>
  );
}

export default function IndicatorBoardToolbar() {
  return (
    <div className="h-full bg-red-800">
      <Tab.Group>
        <Tab.List className="flex space-x-1  bg-blue-900/20 p-1">
          <ToolbarTab tabName="Tool Bar" />
          <ToolbarTab tabName="Meta Data" />
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>Content 1</Tab.Panel>
          <Tab.Panel>
            <MetadataList />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
