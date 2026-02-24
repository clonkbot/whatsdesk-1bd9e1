import { FC, useState, useRef, useEffect } from 'react';
import { Conversation } from '../types';

interface ChatPanelProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
  onCloseTicket: (conversationId: string) => void;
  onShowQuickResponses: () => void;
  onBack: () => void;
}

const ChatPanel: FC<ChatPanelProps> = ({
  conversation,
  onSendMessage,
  onCloseTicket,
  onShowQuickResponses,
  onBack,
}) => {
  const [message, setMessage] = useState('');
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message);
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full pt-16 lg:pt-0">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3 md:gap-4">
          {/* Back button on mobile */}
          <button
            onClick={onBack}
            className="lg:hidden p-2 -ml-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="relative">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-semibold ${
              conversation.status === 'active'
                ? 'bg-gradient-to-br from-whatsapp/30 to-emerald-600/30 text-whatsapp'
                : conversation.status === 'waiting'
                ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-amber-400'
                : 'bg-gradient-to-br from-slate-600/30 to-slate-700/30 text-slate-400'
            }`}>
              {conversation.avatar}
            </div>
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900 ${
              conversation.status === 'active' ? 'bg-whatsapp' :
              conversation.status === 'waiting' ? 'bg-amber-400' :
              'bg-slate-500'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-sm md:text-base">{conversation.customerName}</h3>
            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-400">
              <WhatsAppIcon className="w-3 h-3 md:w-4 md:h-4 text-whatsapp" />
              <span className="truncate max-w-[120px] md:max-w-none">{conversation.customerPhone}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          {conversation.status !== 'resolved' && (
            <button
              onClick={() => onCloseTicket(conversation.id)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all text-sm"
            >
              <CheckIcon className="w-4 h-4" />
              <span className="hidden md:inline">Resolve</span>
            </button>
          )}
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative"
          >
            <MoreIcon className="w-5 h-5" />
          </button>

          {/* Actions dropdown */}
          {showActions && (
            <div className="absolute top-16 right-4 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-10 overflow-hidden min-w-[160px]">
              <button
                onClick={() => {
                  onCloseTicket(conversation.id);
                  setShowActions(false);
                }}
                className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700 transition-colors flex items-center gap-2 sm:hidden"
              >
                <CheckIcon className="w-4 h-4 text-emerald-400" />
                Resolve Ticket
              </button>
              <button className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700 transition-colors">
                View Customer Profile
              </button>
              <button className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700 transition-colors">
                Export Conversation
              </button>
              <button className="w-full px-4 py-3 text-left text-sm hover:bg-slate-700 transition-colors text-rose-400">
                Block Customer
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
        {/* WhatsApp chat pattern background */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2325D366' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative">
          {conversation.messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex mb-3 ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`max-w-[85%] md:max-w-[70%] ${
                msg.sender === 'agent'
                  ? 'bg-whatsapp text-black rounded-2xl rounded-br-sm'
                  : 'bg-slate-800 text-white rounded-2xl rounded-bl-sm'
              } px-4 py-2.5 shadow-lg`}>
                <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${
                  msg.sender === 'agent' ? 'text-black/60' : 'text-slate-500'
                }`}>
                  <span className="text-xs">
                    {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.sender === 'agent' && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 15">
                      <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.511z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-3 md:p-4 border-t border-slate-800/50 bg-slate-900/70 backdrop-blur-sm mb-8">
        <div className="flex items-end gap-2 md:gap-3">
          <button
            onClick={onShowQuickResponses}
            className="flex-shrink-0 p-3 hover:bg-slate-800 rounded-xl transition-colors text-whatsapp"
            title="Quick Responses"
          >
            <LightningIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700/50 rounded-xl text-sm md:text-base resize-none focus:outline-none focus:border-whatsapp/50 focus:ring-1 focus:ring-whatsapp/20 transition-all"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="flex-shrink-0 p-3 bg-whatsapp text-black rounded-xl hover:bg-whatsapp/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SendIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-4 mt-3 px-1">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200">
            <AttachIcon className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200">
            <EmojiIcon className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-slate-200">
            <ImageIcon className="w-5 h-5" />
          </button>
          <span className="flex-1" />
          <span className="text-xs text-slate-600 hidden sm:block">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};

const WhatsAppIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const CheckIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const MoreIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const LightningIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SendIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const AttachIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const EmojiIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ImageIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default ChatPanel;
