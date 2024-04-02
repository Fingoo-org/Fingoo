import CardHeader from './card-header';
import { CardRoot } from './card-root';
import CardContent from './card-content';

const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
});

export default Card;
