"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Globe, Fuel, Clock, Hash, Edit, Trash2, ArrowRight, ArrowLeft, ChevronRight, Check, MessageSquare, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MOCK_AGENTS } from '@/lib/constants';
import { AgentInfoModal } from '@/components/AgentInfoModal';
import { IntegrationCodeModal } from '@/components/IntegrationCodeModal';
import { Agent } from '@/lib/types';

export default function AgentsPage() {
    const router = useRouter();
    // Default to EXPLORE
    const [subTab, setSubTab] = useState<'EXPLORE' | 'DEPLOY'>('EXPLORE');
    const [view, setView] = useState<'LIST' | 'CREATE'>('LIST');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'NAME' | 'COST' | 'DATE'>('NAME');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showIntegrationModal, setShowIntegrationModal] = useState(false);

    // Filter Logic
    const filteredAgents = useMemo(() => {
        let agents = subTab === 'DEPLOY' ? MOCK_AGENTS.filter(a => a.owner.startsWith('0x123')) : MOCK_AGENTS;

        if (searchQuery) {
            agents = agents.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.description.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        return agents.sort((a, b) => {
            if (sortBy === 'NAME') return a.name.localeCompare(b.name);
            if (sortBy === 'COST') return a.costPerRequest - b.costPerRequest;
            if (sortBy === 'DATE') return new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime();
            return 0;
        });
    }, [subTab, searchQuery, sortBy]);

    if (view === 'CREATE') {
        return (
            <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto min-h-screen">
                <button
                    onClick={() => setView('LIST')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={16} /> <span>Back to Agents</span>
                </button>

                <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />

                    <h3 className="text-2xl font-bold mb-6 relative z-10">Deploy New Agent</h3>
                    <div className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1">AGENT NAME</label>
                                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white transition-colors" placeholder="e.g. NeoTrader" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1">DESCRIPTION</label>
                                <textarea className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white h-24 transition-colors resize-none" placeholder="What does this agent do?" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-1">COST PER REQUEST ($)</label>
                                    <input type="number" step="0.01" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white transition-colors" placeholder="0.05" />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-1">DEPLOY URL</label>
                                    <input type="url" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white transition-colors" placeholder="https://..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-1">PROVIDER</label>
                                    <div className="relative">
                                        <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white appearance-none transition-colors cursor-pointer">
                                            <option>Gemini</option>
                                            <option>OpenAI</option>
                                            <option>Anthropic</option>
                                            <option>Mistral</option>
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" size={14} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-500 mb-1">MODEL</label>
                                    <div className="relative">
                                        <select className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white appearance-none transition-colors cursor-pointer">
                                            <option>gemini-2.5-flash</option>
                                            <option>gemini-pro-1.5</option>
                                            <option>gpt-4o</option>
                                            <option>claude-3-opus</option>
                                        </select>
                                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none" size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6 pt-4 border-t border-white/5">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" className="peer sr-only" />
                                    <div className="w-5 h-5 border border-white/20 rounded bg-black/50 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                                    <Check size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Multi-Agent System</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative">
                                    <input type="checkbox" className="peer sr-only" defaultChecked />
                                    <div className="w-5 h-5 border border-white/20 rounded bg-black/50 peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                                    <Check size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100" />
                                </div>
                                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">Enable Streaming</span>
                            </label>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setView('LIST')} className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
                            <button className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primaryDim transition-colors text-sm shadow-[0_0_15px_rgba(0,255,148,0.3)]">Deploy Agent</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Agents Marketplace</h1>
                    <p className="text-gray-400">Discover and integrate verifiable autonomous agents.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
                    {/* Search */}
                    <div className="flex items-center bg-surface border border-white/10 rounded-lg px-3 py-2 w-full md:w-auto focus-within:border-white/30 transition-colors">
                        <Search size={16} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search agents..."
                            className="bg-transparent outline-none text-sm w-48 text-white placeholder-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Tabs Swapped: Explore First */}
                    <div className="bg-surface border border-white/10 rounded-lg p-1 flex">
                        <button
                            onClick={() => setSubTab('EXPLORE')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'EXPLORE' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Explore
                        </button>
                        <button
                            onClick={() => setSubTab('DEPLOY')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${subTab === 'DEPLOY' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            My Agents
                        </button>
                    </div>

                    {subTab === 'DEPLOY' && (
                        <button
                            onClick={() => setView('CREATE')}
                            className="flex items-center space-x-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-primaryDim transition-colors whitespace-nowrap shadow-[0_0_10px_rgba(0,255,148,0.2)]"
                        >
                            <Plus size={16} /> <span>Create Agent</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgents.map((agent) => (
                    <div key={agent.id} className="group relative bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-white/20 transition-all flex flex-col h-full hover:shadow-2xl hover:shadow-primary/5">

                        <div className="relative z-10 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-surfaceHighlight border border-white/10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                    <Globe size={24} className="text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                                <span className={`px-2 py-1 rounded text-[10px] font-mono border ${agent.status === 'Active' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                                    {agent.status.toUpperCase()}
                                </span>
                            </div>

                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors flex-1">{agent.name}</h3>
                                <button
                                    onClick={() => {
                                        setSelectedAgent(agent);
                                        setShowInfoModal(true);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-white transition-colors"
                                    title="View Agent Info"
                                >
                                    <Info size={18} />
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{agent.description}</p>

                            {/* Detailed Blockchain Info */}
                            <div className="bg-black/30 rounded-xl p-3 mb-6 space-y-2 border border-white/5">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1"><Fuel size={12} /> Est. Gas</span>
                                    <span className="text-gray-300 font-mono">{(agent as any).gasFee || '0.1 ADA'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> Block Time</span>
                                    <span className="text-gray-300 font-mono">{(agent as any).blockTime || '20s'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-500 flex items-center gap-1"><Hash size={12} /> Contract</span>
                                    <span className="text-primary font-mono cursor-pointer hover:underline">{(agent as any).contractAddress || 'addr1...'}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-1 text-xs font-mono text-gray-500 mb-6">
                                <div>PROVIDER: <span className="text-gray-300">{agent.provider}</span></div>
                                <div>MODEL: <span className="text-gray-300">{agent.model}</span></div>
                            </div>
                        </div>

                        <div className="mt-auto">
                            {subTab === 'EXPLORE' ? (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => {
                                            const agentSlug = agent.name.toLowerCase().replace(/\s+/g, '-');
                                            router.push(`/chat/${agentSlug}`);
                                        }}
                                        className="flex-1 py-2.5 bg-black border border-primary text-primary rounded-lg font-medium text-sm hover:bg-black/80 hover:border-primary/60 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare size={14} />
                                        Chat Now
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setSelectedAgent(agent);
                                            setShowIntegrationModal(true);
                                        }}
                                        className="flex-1 py-2.5 bg-primary text-black rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        Integrate <ArrowRight size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-2">
                                    <button className="flex-1 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-mono text-xs hover:bg-white/10 transition-colors flex items-center justify-center space-x-2">
                                        <Edit size={12} /> <span>Edit</span>
                                    </button>
                                    <button className="px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showInfoModal && selectedAgent && (
                    <AgentInfoModal
                        agent={selectedAgent}
                        onClose={() => {
                            setShowInfoModal(false);
                            setSelectedAgent(null);
                        }}
                    />
                )}
                {showIntegrationModal && selectedAgent && (
                    <IntegrationCodeModal
                        agent={selectedAgent}
                        onClose={() => {
                            setShowIntegrationModal(false);
                            setSelectedAgent(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
