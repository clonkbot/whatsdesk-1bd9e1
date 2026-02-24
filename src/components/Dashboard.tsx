import { FC } from 'react';
import { Conversation, Ticket } from '../types';

interface DashboardProps {
  stats: {
    activeConversations: number;
    waitingResponses: number;
    resolvedToday: number;
    avgResponseTime: string;
  };
  tickets: Ticket[];
  conversations: Conversation[];
  onViewConversation: (conv: Conversation) => void;
}

const Dashboard: FC<DashboardProps> = ({ stats, tickets, conversations, onViewConversation }) => {
  const openTickets = tickets.filter(t => t.status === 'open');
  const recentConversations = [...conversations]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 4);

  return (
    <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 animate-fade-in">
          <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Command Center</h1>
          <p className="text-slate-400">WhatsApp customer service at a glance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
          <StatCard
            label="Active Chats"
            value={stats.activeConversations}
            icon={<ChatBubbleIcon />}
            color="whatsapp"
            delay={0}
          />
          <StatCard
            label="Awaiting Response"
            value={stats.waitingResponses}
            icon={<ClockIcon />}
            color="amber"
            delay={100}
          />
          <StatCard
            label="Resolved Today"
            value={stats.resolvedToday}
            icon={<CheckIcon />}
            color="emerald"
            delay={200}
          />
          <StatCard
            label="Avg Response"
            value={stats.avgResponseTime}
            icon={<SpeedIcon />}
            color="cyan"
            delay={300}
          />
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          {/* Open Tickets */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 md:p-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="font-display text-lg md:text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Open Tickets
              </h2>
              <span className="text-xs md:text-sm text-slate-500">{openTickets.length} pending</span>
            </div>

            <div className="space-y-3">
              {openTickets.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No open tickets</p>
              ) : (
                openTickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="group bg-slate-800/50 rounded-xl p-3 md:p-4 hover:bg-slate-800 transition-all duration-200 cursor-pointer border border-transparent hover:border-slate-700"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate text-sm md:text-base">{ticket.subject}</p>
                        <p className="text-xs md:text-sm text-slate-400">{ticket.customerName}</p>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'high' ? 'bg-rose-500/20 text-rose-400' :
                        ticket.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-slate-600/20 text-slate-400'
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <ClockIcon className="w-3 h-3" />
                      {formatTimeAgo(ticket.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-4 md:p-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="font-display text-lg md:text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-whatsapp" />
                Recent Activity
              </h2>
              <span className="text-xs md:text-sm text-slate-500">Last 4 chats</span>
            </div>

            <div className="space-y-3">
              {recentConversations.map((conv, index) => (
                <button
                  key={conv.id}
                  onClick={() => onViewConversation(conv)}
                  className="w-full group bg-slate-800/50 rounded-xl p-3 md:p-4 hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-whatsapp/30 text-left"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold text-sm md:text-base ${
                        conv.status === 'active' ? 'bg-gradient-to-br from-whatsapp/30 to-emerald-600/30 text-whatsapp' :
                        conv.status === 'waiting' ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-amber-400' :
                        'bg-gradient-to-br from-slate-600/30 to-slate-700/30 text-slate-400'
                      }`}>
                        {conv.avatar}
                      </div>
                      {conv.unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-whatsapp rounded-full text-xs flex items-center justify-center font-bold text-black">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate text-sm md:text-base">{conv.customerName}</p>
                        <span className="text-xs text-slate-500 flex-shrink-0">{formatTimeAgo(conv.timestamp)}</span>
                      </div>
                      <p className="text-xs md:text-sm text-slate-400 truncate mt-0.5">{conv.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 md:mt-6 bg-gradient-to-r from-whatsapp/10 to-emerald-600/10 border border-whatsapp/20 rounded-2xl p-4 md:p-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <h2 className="font-display text-lg md:text-xl font-semibold mb-3 md:mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {[
              { label: 'New Broadcast', icon: <MegaphoneIcon /> },
              { label: 'Export Report', icon: <DownloadIcon /> },
              { label: 'Team Settings', icon: <SettingsIcon /> },
              { label: 'Help Center', icon: <HelpIcon /> },
            ].map((action, index) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-whatsapp/30 transition-all duration-200"
                style={{ animationDelay: `${600 + index * 50}ms` }}
              >
                <span className="text-whatsapp">{action.icon}</span>
                <span className="text-xs md:text-sm font-medium text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: 'whatsapp' | 'amber' | 'emerald' | 'cyan';
  delay: number;
}

const StatCard: FC<StatCardProps> = ({ label, value, icon, color, delay }) => {
  const colorClasses = {
    whatsapp: 'from-whatsapp/20 to-emerald-600/20 border-whatsapp/30 text-whatsapp',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
    emerald: 'from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400',
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl md:rounded-2xl p-3 md:p-5 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-2 md:mb-3">
        <span className="opacity-70">{icon}</span>
      </div>
      <p className="font-display text-xl md:text-2xl lg:text-3xl font-bold">{value}</p>
      <p className="text-xs md:text-sm text-slate-400 mt-0.5 md:mt-1">{label}</p>
    </div>
  );
};

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const ChatBubbleIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ClockIcon: FC<{ className?: string }> = ({ className = "w-5 h-5 md:w-6 md:h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpeedIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const MegaphoneIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Dashboard;
