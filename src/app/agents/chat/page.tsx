"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Send, Bot, User, Coins, Zap } from 'lucide-react';
import { useListAgentsQuery, useRunAgentMutation } from '@/hooks/useAgents';
import { MOCK_AGENTS } from '@/lib/constants';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatPage() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const agentName = searchParams.get('agent');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    const { data: apiAgents } = useListAgentsQuery();
    const runAgentMutation = useRunAgentMutation();
    
    // Use API agents if available, fallback to mock
    const allAgents = apiAgents?.data && apiAgents.data.length > 0 ? apiAgents.data : MOCK_AGENTS;
    
    const agent = allAgents.find((a: any) => 
        a.name.toLowerCase().replace(/\s+/g, '-') === agentName
    ) || allAgents[0];

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: `Hello! I'm ${agent.name}. ${agent.description} How can I help you today?`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [credits, setCredits] = useState(1250); // Mock credits

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await runAgentMutation.mutateAsync({
                id: agent.id,
                message: currentInput
            });
            
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data || `I understand you're asking about "${currentInput}". Let me help you with that.`,
                timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, assistantMessage]);
            setCredits(prev => Math.max(0, prev - ((agent as any).costPerRequest || (agent as any).agentCost || 0.05) * 100));
        } catch (error) {
            console.error('Failed to get agent response:', error);
            // Fallback to mock response
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `I understand you're asking about "${currentInput}". Let me help you with that. (Fallback response - API unavailable)`,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
            setCredits(prev => Math.max(0, prev - 5)); // Small deduction for fallback
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto min-h-screen flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
                        <p className="text-sm text-gray-400">{agent.description}</p>
                    </div>
                </div>
                
                {/* Credits Display */}
                <div className="flex items-center gap-3 px-4 py-2 bg-surface border border-white/10 rounded-xl">
                    <div className="flex items-center gap-2">
                        <Coins size={18} className="text-primary" />
                        <div>
                            <div className="text-xs text-gray-500 font-mono">Available Credits</div>
                            <div className="text-sm font-bold text-white font-mono">{credits.toLocaleString()}</div>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <Zap size={16} className="text-yellow-400" />
                        <div>
                            <div className="text-xs text-gray-500 font-mono">Cost/Request</div>
                            <div className="text-sm font-bold text-primary font-mono">${(agent as any).costPerRequest || (agent as any).agentCost || '0.05'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {message.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Bot size={18} className="text-primary" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl p-4 ${
                                message.role === 'user'
                                    ? 'bg-primary text-black'
                                    : 'bg-surface border border-white/10 text-white'
                            }`}
                        >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className="text-xs mt-2 opacity-60">
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        {message.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                <User size={18} className="text-white" />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <Bot size={18} className="text-primary" />
                        </div>
                        <div className="bg-surface border border-white/10 rounded-2xl p-4">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="px-6 py-3 bg-primary text-black rounded-xl font-bold hover:bg-primaryDim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
}

