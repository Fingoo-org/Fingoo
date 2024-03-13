import IndicatorList from '../../components/numerical-guidance/indicator/indicator-list';
import Accordion from '../../components/view/molocule/accordion';

export default function IndicatorListContainer() {
  return (
    <div>
      <Accordion type="single" collapsible>
        <Accordion.Item value="indicator">
          <Accordion.Trigger>지표</Accordion.Trigger>
          <Accordion.Content>
            <IndicatorList />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
}
