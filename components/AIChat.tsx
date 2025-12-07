
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { generateAssistantResponse } from '../services/geminiService';

interface AIChatProps {
  context: 'local' | 'global';
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat: React.FC<AIChatProps> = ({ context, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: `Halo! Saya asisten Flexi Tip. Butuh rekomendasi Jastiper terpercaya atau info regulasi bea cukai untuk ${context}?` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    const response = await generateAssistantResponse(userMessage, context);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#06373B] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Sparkles className="h-5 w-5 text-[#FAFF09]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Flexi Assistant</h3>
              <p className="text-xs text-white/70">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4">
          <div className="flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#159946] text-white rounded-br-none' 
                      : 'bg-white text-[#06373B] shadow-sm border border-gray-100 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-none bg-white px-4 py-3 shadow-sm">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-0"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-150"></div>
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 bg-white p-4">
          <div className="flex items-center gap-2 rounded-full bg-gray-100 px-2 py-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Tanya rekomendasi atau regulasi..."
              className="flex-1 bg-transparent px-4 text-sm text-[#06373B] placeholder-gray-400 focus:outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#159946] text-white shadow-sm disabled:opacity-50 hover:bg-[#117a38] transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
