import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MapPin, Calendar, CheckCheck } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface ChatJastiperProps {
    isOpen: boolean;
    onClose: () => void;
    jastiperName: string; // e.g., "Budi Santoso"
    jastiperLocation: string; // e.g., "Tokyo, Jepang"
    returnDate: string; // e.g., "2025-12-20"
    productStock: number;
}

interface Message {
    id: string;
    role: 'user' | 'jastiper';
    content: string;
    timestamp: Date;
    isRead?: boolean;
}

const ChatJastiper: React.FC<ChatJastiperProps> = ({
    isOpen,
    onClose,
    jastiperName,
    jastiperLocation,
    returnDate,
    productStock
}) => {
    const { user } = useAuthStore();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize chat with a welcome message or empty? 
    // User didn't specify initial message, but usually good UX to have one or just blank.
    // Let's start blank or maybe a system message about the trip.
    // Requirement says: "container berisi 'Berada di <daerah> sampai <tanggal>'".
    // This will be in the UI header/banner, so messages can start empty.

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
            isRead: true
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate delay for realism
        setTimeout(() => {
            const responseMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'jastiper',
                content: `Stok masi tersedia ${productStock}. Langsung beli sebelum saya kembali untuk pesanan lain! Terima kasih`,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, responseMsg]);
            setIsTyping(false);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="flex h-[600px] w-full max-w-md flex-col overflow-hidden rounded-[30px] bg-white shadow-2xl ring-1 ring-black/5">

                {/* Header Section */}
                <div className="bg-gradient-to-r from-brand-dark to-brand-medium text-white p-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30 text-lg font-bold">
                                    {jastiperName.charAt(0)}
                                </div>
                                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-brand-dark"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none">{jastiperName}</h3>
                                <p className="text-xs text-white/80 mt-1">Online</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Trip Info Banner */}
                    <div className="bg-brand-darkest/30 backdrop-blur-md rounded-xl p-3 border border-white/10 flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-yellow-400" />
                            <span>Berada di <span className="font-semibold text-yellow-200">{jastiperLocation}</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-yellow-400" />
                            <span>Sampai <span className="font-semibold text-yellow-200">{returnDate}</span></span>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                    {/* Date separator example */}
                    <div className="flex justify-center">
                        <span className="text-[10px] text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                            Hari Ini
                        </span>
                    </div>

                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 space-y-2 opacity-60">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                <Send className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm">Mulai percakapan dengan {jastiperName}</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm relative group ${msg.role === 'user'
                                        ? 'bg-brand-medium text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                    }`}
                            >
                                <p className="leading-relaxed">{msg.content}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.role === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                                    <span>{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {msg.role === 'user' && <CheckCheck className="h-3 w-3" />}
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="bg-white p-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-2 py-2 border border-transparent focus-within:border-brand-medium/30 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-medium/10 transition-all">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Tulis pesan..."
                            className="flex-1 bg-transparent px-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-medium text-white shadow-sm disabled:opacity-50 hover:bg-brand-dark hover:scale-105 active:scale-95 transition-all"
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatJastiper;
