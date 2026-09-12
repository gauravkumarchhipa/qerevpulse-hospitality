import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Props {
  onSendMessage: (message: string) => Promise<string>;
}

export default function ChatInterface({ onSendMessage }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your strategic hospitality finance assistant. Ask me questions like:\n\n• "What should be my budget for next quarter?"\n• "What are my top expenses?"\n• "How can I improve profitability?"\n• "Analyze seasonal trends"\n• "Show revenue breakdown"'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await onSendMessage(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
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
        return <li key={idx} className="ml-4 text-gray-700">{line.substring(1).trim()}</li>;
      }
      if (line.match(/^[0-9]+\./)) {
        return <li key={idx} className="ml-4 text-gray-700">{line.substring(line.indexOf('.') + 1).trim()}</li>;
      }
      if (line.trim() === '') {
        return <br key={idx} />;
      }
      return <p key={idx} className="text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl shadow-xl border border-gray-200 flex flex-col h-[600px]">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Strategic Finance Bot</h2>
            <p className="text-blue-100 text-sm">AI-Powered P&L Analysis</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="bg-blue-500 p-2 rounded-lg h-fit">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                  : 'bg-white shadow-md border border-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <p className="text-white">{message.content}</p>
              ) : (
                <div className="space-y-1">{formatMessage(message.content)}</div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg h-fit">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="bg-blue-500 p-2 rounded-lg h-fit">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white shadow-md border border-gray-100 rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
            placeholder="Ask a strategic question..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
