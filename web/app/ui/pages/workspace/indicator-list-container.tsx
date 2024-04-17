import IndicatorList from '../../components/numerical-guidance/indicator/indicator-list';
import Icon from '../../components/view/atom/icons/variant-icon';
import Accordion from '../../components/view/molecule/accordion';
import { ChartSquareBarIcon } from '@heroicons/react/solid';

export default function IndicatorListContainer() {
  return (
    <div>
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
    </div>
  );
}
