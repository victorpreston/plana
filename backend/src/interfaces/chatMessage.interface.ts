import { User } from './user.interface';
import { Conversation } from './conversation.interface';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender: User;
  conversationId: string;
  conversation: Conversation;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}