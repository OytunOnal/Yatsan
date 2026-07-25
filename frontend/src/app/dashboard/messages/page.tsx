'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ConversationList from '@/components/dashboard/messages/ConversationList';
import MessageList from '@/components/dashboard/messages/MessageList';
import MessageInput from '@/components/dashboard/messages/MessageInput';
import { getConversations, getMessages, sendMessage, markMessagesAsRead, Conversation, Message } from '@/lib/api';

export default function MessagesPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getConversations();
      setConversations(data.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Mesajlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const data = await getMessages(userId);
      setMessages(data.messages || []);

      // Mark messages as read
      const unreadMessageIds = data.messages
        ?.filter((msg) => !msg.read && msg.senderId === userId)
        .map((msg) => msg.id);

      if (unreadMessageIds && unreadMessageIds.length > 0) {
        await markMessagesAsRead({ messageIds: unreadMessageIds });
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSelectConversation = (userId: string) => {
    setSelectedUserId(userId);
    fetchMessages(userId);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedUserId) return;

    try {
      const data = await sendMessage({
        receiverId: selectedUserId,
        content,
      });

      setMessages([...messages, data.message]);

      // Update conversations to reflect the new message
      await fetchConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const selectedConversation = conversations.find((c) => c.user?.id === selectedUserId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
        <p className="text-gray-600 mt-1">İlan alıcılarıyla iletişim kurun</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      ) : error ? (
        <div className="card p-6 border-l-4 border-error-500">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-error-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">Hata</p>
              <p className="text-sm text-gray-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
            {/* Conversations List */}
            <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="font-semibold text-gray-900">Konuşmalar</h2>
                <p className="text-sm text-gray-500">{conversations.length} konuşma</p>
              </div>
              <ConversationList
                conversations={conversations}
                selectedUserId={selectedUserId}
                onSelectConversation={handleSelectConversation}
              />
            </div>

            {/* Messages Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation?.user ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                      {selectedConversation.user.firstName?.charAt(0) || selectedConversation.user.email.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedConversation.user.firstName && selectedConversation.user.lastName
                          ? `${selectedConversation.user.firstName} ${selectedConversation.user.lastName}`
                          : selectedConversation.user.email}
                      </p>
                      <p className="text-sm text-gray-500">{selectedConversation.user.email}</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto">
                    <MessageList messages={messages} currentUserId={selectedConversation.user.id} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <MessageInput onSendMessage={handleSendMessage} />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Mesaj Seçin</h3>
                    <p className="text-gray-600">Görüntülemek için sol taraftan bir konuşma seçin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
