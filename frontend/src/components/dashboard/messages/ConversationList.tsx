'use client';

import { Conversation } from '@/lib/api';

interface ConversationListProps {
  conversations: Conversation[];
  selectedUserId: string | null;
  onSelectConversation: (userId: string) => void;
}

export default function ConversationList({
  conversations,
  selectedUserId,
  onSelectConversation,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-sm text-gray-600">Henüz mesajınız yok</p>
      </div>
    );
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Şimdi';
    if (diffMins < 60) return `${diffMins}d`;
    if (diffHours < 24) return `${diffHours}s`;
    if (diffDays < 7) return `${diffDays}g`;
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="overflow-y-auto h-full">
      <ul className="divide-y divide-gray-100">
        {conversations.map((conversation) => {
          const user = conversation.user;
          if (!user) return null;

          const isSelected = selectedUserId === user.id;
          const hasUnread = conversation.unreadCount > 0;

          return (
            <li key={user.id}>
              <button
                onClick={() => onSelectConversation(user.id)}
                className={`w-full p-4 flex items-start gap-3 transition-colors ${
                  isSelected ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    isSelected ? 'bg-primary-600' : 'bg-gray-400'
                  }`}>
                    {user.firstName?.charAt(0) || user.email.charAt(0)}
                  </div>
                  {hasUnread && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.email}
                    </p>
                    {conversation.latestMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(conversation.latestMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {conversation.latestMessage?.content || 'Mesaj yok'}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
