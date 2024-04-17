import { ConversationCardRoot } from './conversation-card-root';
import ConversationCardHeader from './conversation-card-header';
import ConversationCardContent from './conversation-card-content';

const ConversationCard = Object.assign(ConversationCardRoot, {
  Header: ConversationCardHeader,
  Content: ConversationCardContent,
});

export default ConversationCard;
