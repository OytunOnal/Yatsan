import { api } from '../client';
import { Message, Conversation, PaginatedResponse } from '../types';

// ============================================================================
// MESSAGE API
// ============================================================================

export const getConversations = async (): Promise<{ conversations: Conversation[] }> => {
  const response = await api.get('/messages/conversations');
  return response.data;
};

export const getMessages = async (
  otherUserId: string,
  params?: {
    page?: number;
    limit?: number;
  }
): Promise<PaginatedResponse<Message>> => {
  const response = await api.get(`/messages/${otherUserId}`, { params });
  return {
    messages: response.data.messages,
    total: response.data.total,
    page: response.data.page,
    limit: response.data.limit,
  };
};

export const sendMessage = async (data: {
  receiverId: string;
  listingId?: string;
  content: string;
}): Promise<{ message: Message }> => {
  const response = await api.post('/messages', data);
  return response.data;
};

export const markMessagesAsRead = async (data: {
  messageIds: string[];
}): Promise<{ message: string }> => {
  const response = await api.put('/messages/read', data);
  return response.data;
};
