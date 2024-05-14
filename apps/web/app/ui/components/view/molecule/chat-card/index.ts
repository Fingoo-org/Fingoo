import ChatCardContent from './chat-card-content';
import ChatCardHeader from './chat-card-header';
import { ChatCardRoot } from './chat-card-root';

const ChatCard = Object.assign(ChatCardRoot, {
  Header: ChatCardHeader,
  Content: ChatCardContent,
});

export default ChatCard;
