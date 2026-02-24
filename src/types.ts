export interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'agent';
  timestamp: Date;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  status: 'active' | 'waiting' | 'resolved';
  messages: Message[];
}

export interface Ticket {
  id: string;
  conversationId: string;
  customerName: string;
  subject: string;
  status: 'open' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  closedAt?: Date;
}

export interface QuickResponse {
  id: string;
  title: string;
  content: string;
}
