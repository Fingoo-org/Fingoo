import { AccordionRoot } from './accordion-root';
import { AccordionItem } from './accordion-item';
import { AccordionContent } from './accordion-content';
import { AccordionTrigger } from './accordion-trigger';

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Content: AccordionContent,
  Trigger: AccordionTrigger,
});

export default Accordion;
