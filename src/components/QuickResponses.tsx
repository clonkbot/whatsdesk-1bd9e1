import { FC, useState } from 'react';
import { QuickResponse } from '../types';

interface QuickResponsesProps {
  responses: QuickResponse[];
  onSelect: (content: string) => void;
  onClose: () => void;
}

const QuickResponses: FC<QuickResponsesProps> = ({ responses, onSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResponses = responses.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-whatsapp/20 flex items-center justify-center">
              <LightningIcon className="w-5 h-5 text-whatsapp" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Quick Responses</h3>
              <p className="text-xs text-slate-500">Select a template to send</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800/50">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm focus:outline-none focus:border-whatsapp/50 transition-all"
              autoFocus
            />
          </div>
        </div>

        {/* Responses list */}
        <div className="max-h-[50vh] overflow-auto p-2">
          {filteredResponses.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No templates found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredResponses.map((response, index) => (
                <button
                  key={response.id}
                  onClick={() => onSelect(response.content)}
                  className="w-full text-left p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/70 border border-transparent hover:border-whatsapp/30 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-slate-700/50 rounded-md text-whatsapp font-medium">
                          {response.title}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-2">{response.content}</p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <SendIcon className="w-4 h-4 text-whatsapp" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/50">
          <p className="text-xs text-slate-500 text-center">
            Click a template to send it instantly
          </p>
        </div>
      </div>
    </div>
  );
};

const LightningIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CloseIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SearchIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SendIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default QuickResponses;
