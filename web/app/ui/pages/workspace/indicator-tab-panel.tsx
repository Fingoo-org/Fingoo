import { Disclosure } from '@headlessui/react';
import IndicatorList from '../../components/numerical-guidance/indicator-list';
import { ChevronUpIcon } from '@heroicons/react/solid';

export default function IndicatorTabPanel() {
  return (
    <div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
              <span>지표</span>
              <ChevronUpIcon className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`} />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-yellow-500">
              <IndicatorList />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
