import { FC, useState } from 'react';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
}

const ConversationList: FC<ConversationListProps> = ({ conversations, selectedId, onSelect }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'waiting' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conv => {
    const matchesFilter = filter === 'all' || conv.status === filter;
    const matchesSearch = conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full pt-16 lg:pt-0">
      {/* Header */}
      <div className="p-4 border-b border-slate-800/50">
        <h2 className="font-display text-xl font-semibold mb-4">Conversations</h2>

        {/* Search */}
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:border-whatsapp/50 focus:ring-1 focus:ring-whatsapp/20 transition-all"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-slate-800/30 p-1 rounded-lg">
          {(['all', 'active', 'waiting', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all duration-200 ${
                filter === status
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-auto pb-16">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
            <InboxIcon className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelect(conversation)}
                className={`w-full p-4 text-left transition-all duration-200 hover:bg-slate-800/50 ${
                  selectedId === conversation.id ? 'bg-slate-800/70 border-l-2 border-whatsapp' : 'border-l-2 border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                      conversation.status === 'active'
                        ? 'bg-gradient-to-br from-whatsapp/30 to-emerald-600/30 text-whatsapp'
                        : conversation.status === 'waiting'
                        ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-amber-400'
                        : 'bg-gradient-to-br from-slate-600/30 to-slate-700/30 text-slate-400'
                    }`}>
                      {conversation.avatar}
                    </div>
                    {conversation.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-whatsapp rounded-full text-xs flex items-center justify-center font-bold text-black">
                        {conversation.unread}
                      </span>
                    )}
                    <StatusDot status={conversation.status} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`font-medium truncate ${
                        conversation.unread > 0 ? 'text-white' : 'text-slate-300'
                      }`}>
                        {conversation.customerName}
                      </span>
                      <span className="text-xs text-slate-500 flex-shrink-0">
                        {formatTime(conversation.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm truncate ${
                      conversation.unread > 0 ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        conversation.status === 'active'
                          ? 'bg-whatsapp/20 text-whatsapp'
                          : conversation.status === 'waiting'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-slate-600/20 text-slate-400'
                      }`}>
                        {conversation.status}
                      </span>
                      <span className="text-xs text-slate-600">
                        via WhatsApp
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatusDot: FC<{ status: Conversation['status'] }> = ({ status }) => (
  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
    status === 'active' ? 'bg-whatsapp' :
    status === 'waiting' ? 'bg-amber-400' :
    'bg-slate-500'
  }`} />
);

const formatTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'Now';
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const SearchIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const InboxIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

export default ConversationList;
