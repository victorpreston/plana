import { User } from './user.interface';
import { ChatMessage } from './chatMessage.interface';

export interface Conversation {
  id: string;
  participants: User[];
  messages: ChatMessage[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}