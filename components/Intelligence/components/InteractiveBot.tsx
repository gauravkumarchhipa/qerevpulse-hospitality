import { useState } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, DollarSign, Percent, Filter, X } from 'lucide-react';
import { BotFilters } from '@/lib/enhancedBot';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  filters?: BotFilters;
}

interface Props {
  onSendMessage: (message: string, filters: BotFilters) => Promise<string>;
}

interface SuggestedQuestion {
  text: string;
  icon: any;
  filters: BotFilters;
  color: string;
}

export default function InteractiveBot({ onSendMessage }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome to the Interactive Strategic Analysis Hub! 🎯\n\nI can provide detailed financial insights with customizable filters. Try selecting a time period, category, and metric below, then choose a suggested question or ask your own!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<BotFilters>({
    timeRange: 'all',
    revenueCategory: 'all',
    expenseCategory: 'all',
    metric: 'profit'
  });
  const [showFilters, setShowFilters] = useState(true);

  const suggestedQuestions: SuggestedQuestion[] = [
    {
      text: 'Analyze Q3 room revenue performance',
      icon: DollarSign,
      filters: { timeRange: 'q3', revenueCategory: 'rooms', metric: 'revenue' },
      color: 'from-blue-500 to-cyan-500'
    },
    {
      text: 'Show last 3 months profit trends',
      icon: TrendingUp,
      filters: { timeRange: 'last3', metric: 'profit' },
      color: 'from-emerald-500 to-green-500'
    },
    {
      text: 'Compare Q4 profit margins',
      icon: Percent,
      filters: { timeRange: 'q4', metric: 'margin' },
      color: 'from-purple-500 to-pink-500'
    },
    {
      text: 'Analyze labor cost efficiency',
      icon: DollarSign,
      filters: { timeRange: 'all', expenseCategory: 'labor', metric: 'expenses' },
      color: 'from-orange-500 to-red-500'
    },
    {
      text: 'F&B revenue growth analysis',
      icon: TrendingUp,
      filters: { timeRange: 'all', revenueCategory: 'fb', metric: 'growth' },
      color: 'from-teal-500 to-cyan-500'
    },
    {
      text: 'Last 6 months expense breakdown',
      icon: DollarSign,
      filters: { timeRange: 'last6', metric: 'expenses' },
      color: 'from-slate-500 to-gray-500'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage(input, filters);
  };

  const handleSuggestedQuestion = async (question: SuggestedQuestion) => {
    setFilters(question.filters);
    await sendMessage(question.text, question.filters);
  };

  const sendMessage = async (messageText: string, currentFilters: BotFilters) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = messageText.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, filters: currentFilters }]);
    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage, currentFilters);
      setMessages(prev => [...prev, { role: 'assistant', content: response, filters: currentFilters }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('**') && line.endsWith(':**')) {
        return <h4 key={idx} className="font-bold text-lg text-gray-800 mt-4 mb-2">{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={idx} className="font-semibold text-gray-800 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.startsWith('•') || line.startsWith('-')) {
        return <li key={idx} className="ml-4 text-gray-700 leading-relaxed">{line.substring(1).trim()}</li>;
      }
      if (line.match(/^[0-9]+\./)) {
        return <li key={idx} className="ml-4 text-gray-700 leading-relaxed">{line.substring(line.indexOf('.') + 1).trim()}</li>;
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className="text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  const getFilterLabel = (key: string, value: string): string => {
    const labels: Record<string, Record<string, string>> = {
      timeRange: {
        all: 'Full Year', q1: 'Q1', q2: 'Q2', q3: 'Q3', q4: 'Q4',
        last3: 'Last 3M', last6: 'Last 6M'
      },
      revenueCategory: {
        all: 'All Revenue', rooms: 'Rooms', fb: 'F&B', events: 'Events', other: 'Other'
      },
      expenseCategory: {
        all: 'All Expenses', labor: 'Labor', food: 'F&B Cost', utilities: 'Utilities',
        maintenance: 'Maintenance', marketing: 'Marketing', admin: 'Admin'
      },
      metric: {
        revenue: 'Revenue', expenses: 'Expenses', profit: 'Profit',
        margin: 'Margins', growth: 'Growth'
      }
    };
    return labels[key]?.[value] || value;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-2xl border border-gray-200 flex flex-col h-full">
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Interactive Strategic Bot</h2>
              <p className="text-purple-100 text-sm">AI-Powered Analysis with Smart Filters</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-6 space-y-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Analysis Filters
            </h3>
            <button
              onClick={() => setFilters({
                timeRange: 'all',
                revenueCategory: 'all',
                expenseCategory: 'all',
                metric: 'profit'
              })}
              className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Time Period</label>
              <select
                value={filters.timeRange}
                onChange={(e) => setFilters({ ...filters, timeRange: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Full Year</option>
                <option value="q1">Q1 (Jan-Mar)</option>
                <option value="q2">Q2 (Apr-Jun)</option>
                <option value="q3">Q3 (Jul-Sep)</option>
                <option value="q4">Q4 (Oct-Dec)</option>
                <option value="last3">Last 3 Months</option>
                <option value="last6">Last 6 Months</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Metric Focus</label>
              <select
                value={filters.metric}
                onChange={(e) => setFilters({ ...filters, metric: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="revenue">Revenue Analysis</option>
                <option value="expenses">Expense Analysis</option>
                <option value="profit">Profit Analysis</option>
                <option value="margin">Margin Analysis</option>
                <option value="growth">Growth Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Revenue Category</label>
              <select
                value={filters.revenueCategory}
                onChange={(e) => setFilters({ ...filters, revenueCategory: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Revenue Streams</option>
                <option value="rooms">Rooms Only</option>
                <option value="fb">F&B Only</option>
                <option value="events">Events Only</option>
                <option value="other">Other Revenue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Expense Category</label>
              <select
                value={filters.expenseCategory}
                onChange={(e) => setFilters({ ...filters, expenseCategory: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Expenses</option>
                <option value="labor">Labor Only</option>
                <option value="food">F&B Costs Only</option>
                <option value="utilities">Utilities Only</option>
                <option value="maintenance">Maintenance Only</option>
                <option value="marketing">Marketing Only</option>
                <option value="admin">Administrative Only</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(filters).map(([key, value]) => (
              value !== 'all' && (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                >
                  {getFilterLabel(key, value)}
                </span>
              )
            ))}
          </div>
        </div>
      )}

      <div className="p-6 bg-gradient-to-r from-purple-50 to-fuchsia-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Suggested Questions
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {suggestedQuestions.map((question, idx) => {
            const Icon = question.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSuggestedQuestion(question)}
                disabled={isLoading}
                className={`bg-gradient-to-r ${question.color} text-white px-4 py-3 rounded-xl text-sm font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-left`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-2">{question.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-2 rounded-lg h-fit">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white'
                  : 'bg-white shadow-md border border-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <>
                  <p className="text-white font-medium">{message.content}</p>
                  {message.filters && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Object.entries(message.filters).map(([key, value]) => (
                        value !== 'all' && (
                          <span
                            key={key}
                            className="inline-flex items-center px-2 py-0.5 bg-white/20 text-white text-xs rounded-full"
                          >
                            {getFilterLabel(key, value)}
                          </span>
                        )
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-1">{formatMessage(message.content)}</div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-2 rounded-lg h-fit">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-gradient-to-br from-purple-500 to-fuchsia-500 p-2 rounded-lg h-fit">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a custom strategic question..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-fuchsia-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
            Ask
          </button>
        </div>
      </form>
    </div>
  );
}
