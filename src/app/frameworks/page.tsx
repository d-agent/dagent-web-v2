"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, Copy, BookOpen, Github, ArrowRight, Zap, Shield, Layers, Globe, Terminal } from 'lucide-react';
import { GOOGLE_ADK_SNIPPET, LANGGRAPH_SNIPPET, CREWAI_SNIPPET } from '@/lib/constants';

type FrameworkType = 'Google ADK' | 'LangGraph' | 'CrewAI';

export default function FrameworksPage() {
    const [selectedFramework, setSelectedFramework] = useState<FrameworkType>('Google ADK');
    const [terminalLines, setTerminalLines] = useState<string[]>([]);

    const getSnippet = (framework: FrameworkType) => {
        switch (framework) {
            case 'Google ADK':
                return GOOGLE_ADK_SNIPPET;
            case 'LangGraph':
                return LANGGRAPH_SNIPPET;
            case 'CrewAI':
                return CREWAI_SNIPPET;
            default:
                return GOOGLE_ADK_SNIPPET;
        }
    };

    const getFileName = (framework: FrameworkType) => {
        switch (framework) {
            case 'Google ADK':
                return 'src/agent.py';
            case 'LangGraph':
                return 'src/graph.ts';
            case 'CrewAI':
                return 'src/crew.py';
            default:
                return 'src/agent.py';
        }
    };

    const isComingSoon = (framework: FrameworkType) => {
        return framework === 'LangGraph' || framework === 'CrewAI';
    };

    useEffect(() => {
        setTerminalLines([]);
        const lines = [
            `> Initializing ${selectedFramework} environment...`,
            `> Loading configuration...`,
            `> Connecting to Dagent Network (Cardano)...`,
            `> Verifying agent signature... OK`,
            `> Deploying contract... 0x7F...3a9B`,
            `> Status: Active`
        ];

        let delay = 0;
        lines.forEach((line, index) => {
            delay += 600;
            setTimeout(() => {
                setTerminalLines(prev => [...prev, line]);
            }, delay);
        });
    }, [selectedFramework]);

    const frameworks: FrameworkType[] = ['Google ADK', 'LangGraph', 'CrewAI'];

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-8">
                <div>
                    <h1 className="text-5xl font-bold mb-4 tracking-tight">Developer <span className="text-primary">Console</span></h1>
                    <p className="text-gray-400 max-w-2xl text-lg">
                        The complete toolkit for building autonomous agents on Cardano.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 bg-surface border border-white/10 p-1 rounded-lg mt-6 md:mt-0">
                    {frameworks.map((fw) => (
                        <button
                            key={fw}
                            onClick={() => !isComingSoon(fw) && setSelectedFramework(fw)}
                            disabled={isComingSoon(fw)}
                            className={`px-4 py-2 rounded-md font-mono text-xs transition-all relative ${selectedFramework === fw
                                ? 'bg-white/10 text-white shadow-sm'
                                : isComingSoon(fw)
                                    ? 'text-gray-600 cursor-not-allowed'
                                    : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {fw}
                            {isComingSoon(fw) && (
                                <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-500 text-[10px] rounded-full border border-yellow-500/30">
                                    Soon
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* TOP ROW: Resources & Code */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 h-[500px]">
                {/* Left: Developer Resources */}
                <div className="bg-surface border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
                    <div>
                        <h4 className="font-bold mb-6 flex items-center gap-2 text-2xl">
                            <Box size={24} className="text-secondary" />
                            Developer Resources
                        </h4>
                        <p className="text-gray-400 mb-8">
                            Get up and running with {selectedFramework} in minutes. We provide comprehensive documentation, examples, and community support.
                        </p>
                        <div className="space-y-4">
                            <div className="bg-[#050505] border border-white/10 rounded-lg p-5 flex items-center justify-between group">
                                <code className="text-gray-300 font-mono text-sm">
                                    <span className="text-secondary">$</span> {selectedFramework === 'LangGraph'
                                        ? `bun add @dagent/langgraph`
                                        : selectedFramework === 'Google ADK'
                                            ? 'pip install google-adk dagent-tool'
                                            : 'pip install crewai dagent-tool'}
                                </code>
                                <button className="text-gray-500 hover:text-white transition-colors">
                                    <Copy size={16} />
                                </button>
                            </div>
                            <ul className="space-y-2 text-sm mt-4">
                                <li className="flex items-center justify-between p-3 rounded hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/5">
                                    <span className="flex items-center gap-3"><BookOpen size={16} /> Full API Reference</span>
                                    <ArrowRight size={14} />
                                </li>
                                <li className="flex items-center justify-between p-3 rounded hover:bg-white/5 cursor-pointer text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/5">
                                    <span className="flex items-center gap-3"><Github size={16} /> Github Repository</span>
                                    <ArrowRight size={14} />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <a
                        href="https://github.com/d-agent"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white text-black px-4 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm uppercase tracking-wider text-center block"
                    >
                        Read Documentation
                    </a>
                </div>

                {/* Right: Code */}
                <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                    <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5 justify-between shrink-0">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-xs font-mono text-gray-500">
                            {getFileName(selectedFramework)}
                        </span>
                        <Copy size={14} className="text-gray-500 hover:text-white cursor-pointer" />
                    </div>
                    <div className="p-6 overflow-auto custom-scrollbar flex-1">
                        <pre className="font-mono text-sm leading-relaxed text-gray-300">
                            {getSnippet(selectedFramework)}
                        </pre>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: Features & Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Features Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { icon: Zap, title: "Instant Deploy", desc: "One command deployment." },
                        { icon: Shield, title: "Wallet Built-in", desc: "Non-custodial secure wallet." },
                        { icon: Layers, title: "State Mgmt", desc: "Persistent on-chain memory." },
                        { icon: Globe, title: "Global API", desc: "High-performance access." },
                    ].map((item, i) => (
                        <div key={i} className="bg-surface border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <item.icon size={20} className="text-primary" />
                                <h4 className="font-bold text-base">{item.title}</h4>
                            </div>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Terminal */}
                <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 font-mono text-sm relative overflow-hidden shadow-lg min-h-[250px]">
                    <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 flex items-center px-4 space-x-2">
                        <Terminal size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-500">Dagent CLI</span>
                    </div>
                    <div className="mt-8 space-y-2">
                        <div className="text-gray-400">$ dagent deploy --network cardano-mainnet</div>
                        {terminalLines.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-primary"
                            >
                                {line}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
