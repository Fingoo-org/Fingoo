import IndicatorListTypeToggleGroup from '@/app/ui/components/numerical-guidance/indicator/indicator-list/indicator-list-type-toggle-group';
import IndicatorList from '../../../components/numerical-guidance/indicator/indicator-list/indicator-list';
import Icon from '../../../components/view/atom/icons/variant-icon';
import Accordion from '../../../components/view/molecule/accordion';
import { ChartSquareBarIcon } from '@heroicons/react/solid';
import IndicatorListResult from '@/app/ui/components/numerical-guidance/indicator/indicator-list/indicator-list-result';

export default function IndicatorListContainer() {
  return (
    <div className="flex h-full flex-col">
      <IndicatorListTypeToggleGroup />
      <IndicatorListResult />
      {/* <DepretedComponent /> */}
    </div>
  );
}

function DepretedComponent() {
  return (
    <Accordion type="single" collapsible>
      <Accordion.Item value="indicator">
        <Accordion.Trigger>
          <div className="text-md flex items-center py-1">
            <Icon size={'md'} icon={ChartSquareBarIcon} color={'gray'} />
            <div className="pl-3">지표</div>
          </div>
        </Accordion.Trigger>
        <Accordion.Content>
          <IndicatorList />
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}
