'use client';

import { Message } from '@/lib/api';
import { useEffect, useRef } from 'react';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Bugün';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Dün';
    } else {
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-600">Bu konuşmada henüz mesaj yok</p>
          <p className="text-sm text-gray-500 mt-1">İlk mesajı gönderin</p>
        </div>
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: Record<string, Message[]> = {};
  messages.forEach((message) => {
    const dateKey = new Date(message.createdAt).toDateString();
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(message);
  });

  return (
    <div className="p-4 space-y-4">
      {Object.entries(groupedMessages).map(([dateKey, dateMessages]) => (
        <div key={dateKey}>
          {/* Date Separator */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {formatDate(dateMessages[0].createdAt)}
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Messages */}
          <div className="space-y-3">
            {dateMessages.map((message) => {
              const isOwn = message.senderId === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`px-4 py-2.5 rounded-2xl ${
                        isOwn
                          ? 'bg-primary-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
