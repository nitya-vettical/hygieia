import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser, FaInfoCircle, FaHistory } from 'react-icons/fa';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message
    setMessages([{
      text: "Hello! I'm HYGIEIA, your personal health assistant. Please describe your symptoms, and I'll help identify potential conditions. Remember, this is for informational purposes only and should not replace professional medical advice.",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/predict', {
        symptoms: input
      });

      const botMessage = {
        text: response.data.prediction,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        text: "I apologize, but I couldn't process your request at the moment. Please try again or rephrase your symptoms.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const clearChat = () => {
    setMessages([{
      text: "Hello! I'm HYGIEIA, your personal health assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12 chat-container">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto w-full px-4 sm:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl px-4 py-10 sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <FaRobot className="text-4xl text-primary mr-3" />
                    <h1 className="text-3xl font-bold text-primary">HYGIEIA</h1>
                  </div>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-gray-500 hover:text-primary transition-colors"
                    title="Chat History"
                  >
                    <FaHistory className="text-xl" />
                  </button>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaInfoCircle className="mr-2 text-primary" />
                    <p>Please note: This is an AI assistant and should not replace professional medical advice.</p>
                  </div>
                </div>
                
                <div className="h-[400px] overflow-y-auto mb-4 space-y-4 bg-gray-50 p-4 rounded-lg">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-appear`}
                    >
                      <div className="flex items-start max-w-[80%] space-x-2">
                        {!message.isUser && (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <FaRobot className="text-white text-sm" />
                          </div>
                        )}
                        <div
                          className={`rounded-lg p-3 ${
                            message.isUser
                              ? 'bg-primary text-white rounded-br-none'
                              : 'bg-white shadow-md text-gray-800 rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                        </div>
                        {message.isUser && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaUser className="text-gray-500 text-sm" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start message-appear">
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <FaRobot className="text-white text-sm" />
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-4 rounded-bl-none">
                          <div className="typing-animation">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="mt-6">
                  <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Describe your symptoms..."
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50"
                        disabled={isLoading}
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        <FaPaperPlane className="mr-2" />
                        Send
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={clearChat}
                      className="text-sm text-gray-500 hover:text-primary transition-colors"
                    >
                      Clear conversation
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;