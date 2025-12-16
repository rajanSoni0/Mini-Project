import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import StressReliefModal from './StressReliefModal';

const ChatPage = ({ token, username, onLogout, apiUrl }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStressRelief, setShowStressRelief] = useState(false);
  const [lastSentiment, setLastSentiment] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${apiUrl}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/chat/message`,
        { message: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data]);
      setLastSentiment(response.data.sentiment);

      // Show stress relief if negative sentiment
      if (response.data.sentiment === 'NEGATIVE') {
        setTimeout(() => setShowStressRelief(true), 1000);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm('Are you sure you want to clear all chat history?')) return;

    try {
      await axios.delete(`${apiUrl}/chat/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
    }
  };

  const getSentimentColor = (sentiment) => {
    if (sentiment === 'POSITIVE') return 'text-green-600';
    if (sentiment === 'NEGATIVE') return 'text-red-600';
    return 'text-gray-600';
  };

  const getSentimentEmoji = (sentiment) => {
    if (sentiment === 'POSITIVE') return '😊';
    if (sentiment === 'NEGATIVE') return '😔';
    return '😐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">CompanionBot</h1>
              <p className="text-xs text-gray-500">Welcome, {username}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              data-testid="clear-history-button"
              onClick={handleClearHistory}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
            >
              Clear History
            </button>
            <button
              data-testid="logout-button"
              onClick={onLogout}
              className="px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl h-[calc(100vh-200px)] flex flex-col">
          {/* Messages */}
          <div data-testid="chat-messages-container" className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Start a conversation</h3>
                <p className="text-gray-500">I'm here to listen and support you 💙</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div key={msg.id || index} className="space-y-3">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl rounded-tr-sm px-5 py-3 shadow-md message-bubble">
                    <p data-testid={`user-message-${index}`} className="text-sm leading-relaxed">{msg.user_message}</p>
                  </div>
                </div>

                {/* Bot Message with Sentiment */}
                <div className="flex justify-start">
                  <div className="max-w-[70%]">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md message-bubble">
                      <p data-testid={`bot-message-${index}`} className="text-sm text-gray-800 leading-relaxed">{msg.bot_response}</p>
                    </div>
                    <div className="flex items-center space-x-2 mt-2 ml-2">
                      <span className={`text-xs font-medium ${getSentimentColor(msg.sentiment)}`}>
                        {getSentimentEmoji(msg.sentiment)} {msg.sentiment}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-5 py-3 shadow-md">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <input
                data-testid="message-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share how you're feeling..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                disabled={loading}
              />
              <button
                data-testid="send-message-button"
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Stress Relief Modal */}
      {showStressRelief && (
        <StressReliefModal onClose={() => setShowStressRelief(false)} />
      )}
    </div>
  );
};

export default ChatPage;