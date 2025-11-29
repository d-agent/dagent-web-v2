"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, Star, Users, Code, Zap, CheckCircle2 } from 'lucide-react';
import { Agent } from '@/lib/types';

interface AgentInfoModalProps {
    agent: Agent;
    onClose: () => void;
}

export const AgentInfoModal: React.FC<AgentInfoModalProps> = ({ agent, onClose }) => {
    // Mock data for agent details
    const agentDetails = {
        rating: 4.8,
        reviews: 324,
        users: 15420,
        tags: ['#crypto', '#stocks', '#ml', '#automated'],
        costPerToken: '$0.0012',
        version: 'v2.1.0',
        coreSkills: ['Trading', 'Market Analysis', 'Risk Management', 'Portfolio Optimization'],
        features: ['Real-time Analysis', 'Multi-exchange Support', 'Risk Management', 'Backtesting'],
        inputPrice: '$10',
        outputPrice: '$30',
        category: 'Trading',
        updated: '2 days ago',
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">{agent.name}</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">{agent.description}</p>
                    </div>

                    {/* Rating and Stats */}
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Star size={18} className="text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-white">{agentDetails.rating}</span>
                            <span className="text-gray-400 text-sm">({agentDetails.reviews})</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                            <Users size={18} />
                            <span className="text-sm">{agentDetails.users.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {agentDetails.tags.map((tag, i) => (
                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 font-mono">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Technical Specifications */}
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4">Technical Specifications</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">LLM Provider</div>
                                <div className="text-sm text-white font-mono">{agent.provider}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Model</div>
                                <div className="text-sm text-white font-mono">{agent.model}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Cost per Token</div>
                                <div className="text-sm text-primary font-mono">{agentDetails.costPerToken}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Version</div>
                                <div className="text-sm text-white font-mono">{agentDetails.version}</div>
                            </div>
                        </div>
                    </div>

                    {/* Core Skills */}
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4">Core Skills</h3>
                        <div className="flex flex-wrap gap-2">
                            {agentDetails.coreSkills.map((skill, i) => (
                                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                                    <CheckCircle2 size={14} className="text-primary" />
                                    <span className="text-sm text-white">{skill}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features & Capabilities */}
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4">Features & Capabilities</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {agentDetails.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                                    <Zap size={14} className="text-primary" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Author */}
                    <div className="border-t border-white/10 pt-6">
                        <div className="text-xs text-gray-500 mb-1">Author</div>
                        <div className="text-sm text-white font-mono break-all">{agent.owner}</div>
                    </div>

                    {/* Capabilities */}
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4">Capabilities</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Code size={16} className="text-primary" />
                                <span className="text-gray-300">Streaming: {agent.isStreaming ? 'Enabled' : 'Disabled'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Users size={16} className="text-primary" />
                                <span className="text-gray-300">Multi-Agent: {agent.type === 'Multi-Agent' ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-white mb-4">Pricing (per 1M tokens)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Input</div>
                                <div className="text-sm text-white font-mono">{agentDetails.inputPrice}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-1">Output</div>
                                <div className="text-sm text-white font-mono">{agentDetails.outputPrice}</div>
                            </div>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="border-t border-white/10 pt-6">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-gray-500 mb-1">Category</div>
                                <div className="text-white">{agentDetails.category}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 mb-1">Updated</div>
                                <div className="text-white">{agentDetails.updated}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
