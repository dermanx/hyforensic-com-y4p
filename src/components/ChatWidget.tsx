import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { generateResponse } from '../lib/ai';
import { CHAT_MESSAGES } from '../lib/constants';
import { validateEnvironment, checkRateLimit } from '../lib/env';
import { encryptData, decryptData } from '../lib/security';
import { User } from '../lib/auth';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  error?: boolean;
  timestamp: number;
  encrypted?: boolean;
}

interface ChatWidgetProps {
  user?: User;
}
export default function ChatWidget({ user }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const envError = validateEnvironment();
  const isApiKeyValid = !envError;

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome',
      text: isApiKeyValid && user ? CHAT_MESSAGES.WELCOME : 
            !user ? CHAT_MESSAGES.AUTH_REQUIRED :
            envError || CHAT_MESSAGES.MAINTENANCE,
      isBot: true,
      timestamp: Date.now()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    if (!user) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: CHAT_MESSAGES.AUTH_REQUIRED,
        isBot: true,
        error: true,
        timestamp: Date.now()
      }]);
      return;
    }
    
    if (user && !checkRateLimit(user.id)) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: CHAT_MESSAGES.RATE_LIMIT_EXCEEDED,
        isBot: true,
        error: true,
        timestamp: Date.now()
      }]);
      return;
    }

    const messageId = Date.now().toString();
    const timestamp = Date.now();
    const userMessage = sanitizeInput(inputMessage.trim());
    
    // Encrypt sensitive messages
    const shouldEncrypt = userMessage.match(/\b(password|credit|ssn|key|secret|token)\b/i);
    const messageText = shouldEncrypt ? encryptData(userMessage) : userMessage;
    
    setInputMessage("");
    setIsLoading(true);

    setMessages(prev => [...prev, { 
      id: `user-${messageId}`,
      text: messageText,
      isBot: false,
      timestamp,
      encrypted: shouldEncrypt
    }]);

    try {
      const response = await generateResponse(messageText);
      setMessages(prev => [...prev, { 
        id: `bot-${messageId}`,
        text: response, 
        isBot: true,
        timestamp: Date.now(),
        encrypted: shouldEncrypt
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: `error-${messageId}`,
        text: CHAT_MESSAGES.DEFAULT_ERROR, 
        isBot: true, 
        error: true,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className={`fixed bottom-4 right-4 z-50 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col">
          <div className="bg-blue-500 p-4 rounded-t-lg flex items-center">
            <Bot className="w-6 h-6 text-white mr-2" />
            <h3 className="text-white font-semibold">HYFORENSIC Destek</h3>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? message.error
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Mesajınızı yazın..."
                disabled={isLoading || !isApiKeyValid}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-blue-500"
                aria-label="Chat message"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !isApiKeyValid}
                className={`p-2 rounded-lg transition-colors ${
                  isLoading || !isApiKeyValid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}