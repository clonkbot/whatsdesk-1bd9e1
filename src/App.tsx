import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ConversationList from './components/ConversationList';
import ChatPanel from './components/ChatPanel';
import QuickResponses from './components/QuickResponses';
import { Conversation, Ticket, QuickResponse } from './types';

const initialConversations: Conversation[] = [
  {
    id: '1',
    customerName: 'Sarah Mitchell',
    customerPhone: '+1 (555) 234-5678',
    avatar: 'SM',
    lastMessage: 'Hi, I have a question about my recent order #45892',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    unread: 2,
    status: 'active',
    messages: [
      { id: 'm1', content: 'Hi, I have a question about my recent order #45892', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 10) },
      { id: 'm2', content: 'Hello Sarah! I\'d be happy to help you with your order. What seems to be the issue?', sender: 'agent', timestamp: new Date(Date.now() - 1000 * 60 * 8) },
      { id: 'm3', content: 'The tracking shows delivered but I haven\'t received it yet', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
      { id: 'm4', content: 'It\'s been 3 days now', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    ]
  },
  {
    id: '2',
    customerName: 'James Rodriguez',
    customerPhone: '+1 (555) 876-4321',
    avatar: 'JR',
    lastMessage: 'Thanks for the quick response!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: 0,
    status: 'active',
    messages: [
      { id: 'm1', content: 'Can you help me with a refund?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
      { id: 'm2', content: 'Of course! I\'ve initiated the refund process. You should see it in 3-5 business days.', sender: 'agent', timestamp: new Date(Date.now() - 1000 * 60 * 35) },
      { id: 'm3', content: 'Thanks for the quick response!', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    ]
  },
  {
    id: '3',
    customerName: 'Emma Thompson',
    customerPhone: '+1 (555) 111-2233',
    avatar: 'ET',
    lastMessage: 'Is the product available in blue?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    unread: 1,
    status: 'waiting',
    messages: [
      { id: 'm1', content: 'Is the product available in blue?', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    ]
  },
  {
    id: '4',
    customerName: 'Michael Chen',
    customerPhone: '+1 (555) 444-5566',
    avatar: 'MC',
    lastMessage: 'Perfect, that resolves my issue. Thank you!',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    unread: 0,
    status: 'resolved',
    messages: [
      { id: 'm1', content: 'My subscription isn\'t working', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 150) },
      { id: 'm2', content: 'I\'ve reset your subscription. Please try logging out and back in.', sender: 'agent', timestamp: new Date(Date.now() - 1000 * 60 * 130) },
      { id: 'm3', content: 'Perfect, that resolves my issue. Thank you!', sender: 'customer', timestamp: new Date(Date.now() - 1000 * 60 * 120) },
    ]
  },
];

const initialTickets: Ticket[] = [
  { id: 't1', conversationId: '4', customerName: 'Michael Chen', subject: 'Subscription Reset', status: 'closed', priority: 'medium', createdAt: new Date(Date.now() - 1000 * 60 * 150), closedAt: new Date(Date.now() - 1000 * 60 * 110) },
  { id: 't2', conversationId: '2', customerName: 'James Rodriguez', subject: 'Refund Request', status: 'closed', priority: 'high', createdAt: new Date(Date.now() - 1000 * 60 * 45), closedAt: new Date(Date.now() - 1000 * 60 * 25) },
  { id: 't3', conversationId: '1', customerName: 'Sarah Mitchell', subject: 'Missing Delivery', status: 'open', priority: 'high', createdAt: new Date(Date.now() - 1000 * 60 * 10) },
  { id: 't4', conversationId: '3', customerName: 'Emma Thompson', subject: 'Product Inquiry', status: 'open', priority: 'low', createdAt: new Date(Date.now() - 1000 * 60 * 60) },
];

const quickResponses: QuickResponse[] = [
  { id: 'qr1', title: 'Greeting', content: 'Hello! Thank you for reaching out. How can I assist you today?' },
  { id: 'qr2', title: 'Order Status', content: 'I\'d be happy to check your order status. Could you please provide your order number?' },
  { id: 'qr3', title: 'Refund Info', content: 'Refunds typically take 3-5 business days to process. I\'ll initiate this for you right away.' },
  { id: 'qr4', title: 'Thank You', content: 'Thank you for your patience! Is there anything else I can help you with?' },
  { id: 'qr5', title: 'Escalation', content: 'I understand your concern. Let me escalate this to our specialist team for faster resolution.' },
  { id: 'qr6', title: 'Closing', content: 'It was my pleasure assisting you today. Have a great day!' },
];

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [activeView, setActiveView] = useState<'dashboard' | 'conversations' | 'tickets'>('dashboard');
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage = {
      id: `m${Date.now()}`,
      content,
      sender: 'agent' as const,
      timestamp: new Date(),
    };

    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation.id
        ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: content, timestamp: new Date() }
        : conv
    ));

    setSelectedConversation(prev => prev ? { ...prev, messages: [...prev.messages, newMessage], lastMessage: content } : null);
  };

  const handleCloseTicket = (conversationId: string) => {
    setConversations(prev => prev.map(conv =>
      conv.id === conversationId ? { ...conv, status: 'resolved' } : conv
    ));
    setTickets(prev => prev.map(ticket =>
      ticket.conversationId === conversationId ? { ...ticket, status: 'closed', closedAt: new Date() } : ticket
    ));
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setConversations(prev => prev.map(c =>
      c.id === conv.id ? { ...c, unread: 0 } : c
    ));
    setMobileChatOpen(true);
  };

  const stats = {
    activeConversations: conversations.filter(c => c.status === 'active').length,
    waitingResponses: conversations.filter(c => c.status === 'waiting').length,
    resolvedToday: tickets.filter(t => t.status === 'closed' && t.closedAt && (Date.now() - t.closedAt.getTime()) < 86400000).length,
    avgResponseTime: '2m 34s',
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-body transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(90deg, #25D366 0px, #25D366 1px, transparent 1px, transparent 60px),
                           repeating-linear-gradient(0deg, #25D366 0px, #25D366 1px, transparent 1px, transparent 60px)`
        }} />
      </div>

      <div className="relative flex h-screen overflow-hidden">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={(view) => {
            setActiveView(view);
            setMobileMenuOpen(false);
          }}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Main content area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {activeView === 'dashboard' && (
            <Dashboard
              stats={stats}
              tickets={tickets}
              conversations={conversations}
              onViewConversation={(conv) => {
                setSelectedConversation(conv);
                setActiveView('conversations');
                setMobileChatOpen(true);
              }}
            />
          )}

          {activeView === 'conversations' && (
            <>
              {/* Conversation List - hidden on mobile when chat is open */}
              <div className={`${mobileChatOpen ? 'hidden' : 'flex'} lg:flex flex-col w-full lg:w-96 border-r border-slate-800/50 bg-slate-900/50`}>
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedConversation?.id}
                  onSelect={handleSelectConversation}
                />
              </div>

              {/* Chat Panel */}
              <div className={`${mobileChatOpen ? 'flex' : 'hidden'} lg:flex flex-1 flex-col bg-slate-900/30`}>
                {selectedConversation ? (
                  <ChatPanel
                    conversation={selectedConversation}
                    onSendMessage={handleSendMessage}
                    onCloseTicket={handleCloseTicket}
                    onShowQuickResponses={() => setShowQuickResponses(true)}
                    onBack={() => setMobileChatOpen(false)}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-800/50 flex items-center justify-center">
                        <svg className="w-10 h-10 text-whatsapp" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <p className="font-display text-lg">Select a conversation</p>
                      <p className="text-sm mt-1">Choose from your active chats to continue</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeView === 'tickets' && (
            <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
              <div className="max-w-6xl mx-auto">
                <h1 className="font-display text-2xl md:text-3xl font-bold mb-6 md:mb-8">Ticket Management</h1>

                <div className="grid gap-4">
                  {tickets.map((ticket, index) => (
                    <div
                      key={ticket.id}
                      className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 md:p-5 hover:border-whatsapp/30 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              ticket.status === 'open' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {ticket.status.toUpperCase()}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              ticket.priority === 'high' ? 'bg-rose-500/20 text-rose-400' :
                              ticket.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                              'bg-slate-500/20 text-slate-400'
                            }`}>
                              {ticket.priority.toUpperCase()}
                            </span>
                          </div>
                          <h3 className="font-semibold text-base md:text-lg truncate">{ticket.subject}</h3>
                          <p className="text-slate-400 text-sm">{ticket.customerName}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500">Created</p>
                          <p className="text-sm">{ticket.createdAt.toLocaleDateString()}</p>
                          {ticket.closedAt && (
                            <>
                              <p className="text-xs text-slate-500 mt-1">Closed</p>
                              <p className="text-sm text-emerald-400">{ticket.closedAt.toLocaleDateString()}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Quick Responses Modal */}
        {showQuickResponses && (
          <QuickResponses
            responses={quickResponses}
            onSelect={(content) => {
              handleSendMessage(content);
              setShowQuickResponses(false);
            }}
            onClose={() => setShowQuickResponses(false)}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 py-2 px-4 bg-slate-950/80 backdrop-blur-sm border-t border-slate-800/30 z-30">
        <p className="text-center text-xs text-slate-600">
          Requested by <span className="text-slate-500">@davionjm</span> · Built by <span className="text-slate-500">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
