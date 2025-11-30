"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Cpu, Shield, Zap, Wallet, Code, Terminal, Sparkles } from 'lucide-react';
import { CoreAgentNetwork } from '@/components/AnimatedBeam';
import { WalletSelectionModal } from '@/components/WalletSelectionModal';
import { WalletNotification } from '@/components/WalletNotification';
import Link from 'next/link';
import { useWallet } from '@meshsdk/react';

export default function Home() {
    const { wallet, connected } = useWallet();
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [notification, setNotification] = useState<{ 
        type: 'success' | 'error' | null; 
        message?: string; 
        error?: string 
    }>({ type: null });

    // Sync wallet connection state with Mesh SDK
    useEffect(() => {
        setIsWalletConnected(connected);
    }, [connected]);

    const handleConnect = () => {
        setNotification({ type: 'success', message: 'Wallet connected successfully!' });
        setIsWalletConnected(true);
        setShowWalletModal(false);
    };

    const handleOpenModal = () => {
        setShowWalletModal(true);
    };

    return (
        <div className="min-h-screen flex flex-col w-full">
            {!isWalletConnected && (
                <div className="absolute top-6 right-6 z-40">
                    <button
                        type="button"
                        onClick={handleOpenModal}
                        className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all flex items-center space-x-2 shadow-lg cursor-pointer"
                    >
                        <Wallet size={16} className="text-primary" />
                        <span>Connect with Cardano</span>
                    </button>
                </div>
            )}

            {showWalletModal && (
                <WalletSelectionModal
                    key="wallet-modal"
                    onClose={() => setShowWalletModal(false)}
                    onConnect={handleConnect}
                    onError={(error: string) => setNotification({ type: 'error', error })}
                    onConnecting={() => { }}
                />
            )}

            <AnimatePresence>
                {notification.type && (
                    <WalletNotification
                        type={notification.type}
                        message={notification.message}
                        error={notification.error}
                        onClose={() => setNotification({ type: null })}
                    />
                )}
            </AnimatePresence>

            <div className="pt-32 px-6 w-full space-y-24 flex-1">
                {/* Hero Section */}
                <section className="text-center space-y-8 relative py-12">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4"
                    >
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-xs text-primary font-mono tracking-wider">CARDANO MAINNET LIVE</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-5xl mx-auto">
                        The AI Agent <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Marketplace on Cardano</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        Deploy, monetize, and earn rewards from your AI agents. Built on Cardano blockchain with verified agents and transparent staking rewards.
                    </p>

                    <CoreAgentNetwork />

                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                        {!isWalletConnected ? (
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="group relative px-8 py-4 bg-primary text-black rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,148,0.4)] cursor-pointer"
                            >
                                <span className="relative flex items-center space-x-2">
                                    <span>Connect with Cardano</span>
                                    <ArrowRight size={20} />
                                </span>
                            </button>
                        ) : (
                            <Link
                                href="/agents"
                                className="group relative px-8 py-4 bg-primary text-black rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,148,0.4)]"
                            >
                                <span className="relative flex items-center space-x-2">
                                    <span>Browse Marketplace</span>
                                    <ArrowRight size={20} />
                                </span>
                            </Link>
                        )}

                        <Link
                            href="https://github.com/d-agent"
                            className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition-all"
                        >
                            Learn More
                        </Link>
                    </div>
                </section>

                {/* Low Config Highlight */}
                <section className="max-w-7xl mx-auto px-6 pb-12">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-white/10 p-12">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <div className="relative z-10 text-center max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-mono mb-6">
                                <Sparkles size={16} />
                                <span>MINIMAL SETUP REQUIRED</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                3 Steps to Deploy Your Agent
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                No complex configuration. No infrastructure management. Just install, create an API key, and start earning rewards on Cardano.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                                {[
                                    { num: '01', title: 'Install Package', desc: 'pip install dagent-tool' },
                                    { num: '02', title: 'Get API Key', desc: 'Create your DAGENT_API_KEY' },
                                    { num: '03', title: 'Deploy & Earn', desc: 'Connect and monetize' },
                                ].map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative p-6 rounded-2xl bg-black/40 border border-white/10"
                                    >
                                        <div className="text-4xl font-bold text-primary/30 mb-2">{step.num}</div>
                                        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                                        <p className="text-sm text-gray-400 font-mono">{step.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Framework Integrations */}
                <section className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Framework Integrations</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Seamlessly integrate with your favorite AI frameworks. Install the package, add your API key, and you're ready to go.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                name: 'Google ADK',
                                desc: 'Build agents with Google\'s Agent Development Kit',
                                color: '#3B82F6',
                                install: 'pip install google-adk dagent-tool',
                                code: `from google.adk.agents.llm_agent import Agent
from dagent_tool import adk_tool

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant for user questions.',
    instruction='Answer user questions to the best of your knowledge and use adk_tool to connect with other agents and answer the questions effectively',
    tools=[adk_tool]
)`,
                                comingSoon: false
                            },
                            {
                                name: 'LangChain',
                                desc: 'Build context-aware agents with LangChain',
                                color: '#00FF94',
                                install: 'pip install langchain dagent-tool',
                                code: `from langchain.agents import initialize_agent
from dagent_tool import DagentTool

# Initialize with Dagent
tools = [DagentTool(api_key=DAGENT_API_KEY)]
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent="zero-shot-react-description"
)`,
                                comingSoon: true
                            },
                            {
                                name: 'CrewAI',
                                desc: 'Create multi-agent systems with CrewAI',
                                color: '#9D00FF',
                                install: 'pip install crewai dagent-tool',
                                code: `from crewai import Agent, Task, Crew
from dagent_tool import dagent_tool

agent = Agent(
    role='Research Assistant',
    goal='Gather information',
    tools=[dagent_tool],
    backstory='Expert researcher'
)`,
                                comingSoon: true
                            },
                        ].map((framework, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-2xl bg-surface border border-white/5 hover:border-primary/30 transition-all group relative"
                            >
                                {framework.comingSoon && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-mono">
                                        COMING SOON
                                    </div>
                                )}

                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className="w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl"
                                        style={{
                                            backgroundColor: `${framework.color}20`,
                                            color: framework.color,
                                            border: `2px solid ${framework.color}40`
                                        }}
                                    >
                                        {framework.name.substring(0, 2)}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{framework.name}</h3>
                                        <p className="text-gray-400 text-sm">{framework.desc}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Terminal size={16} className="text-primary" />
                                        <span className="text-xs font-mono text-gray-500">INSTALL</span>
                                    </div>
                                    <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                                        <code className="text-sm font-mono text-primary">{framework.install}</code>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Code size={16} className="text-secondary" />
                                        <span className="text-xs font-mono text-gray-500">EXAMPLE</span>
                                    </div>
                                    <div className="bg-black/40 rounded-lg p-4 border border-white/5 overflow-x-auto">
                                        <pre className="text-xs font-mono text-gray-300">
                                            <code>{framework.code}</code>
                                        </pre>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <Link
                            href="/frameworks"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <span>View Full Documentation</span>
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>

                {/* Cardano Ecosystem */}
                <section className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-white/10 p-12">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-mono mb-4">
                                    POWERED BY CARDANO
                                </div>
                                <h2 className="text-4xl font-bold mb-4">Built on the Most Secure Blockchain</h2>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    Dagent leverages Cardano's peer-reviewed blockchain technology to ensure your agents are secure, verifiable, and truly decentralized. Every transaction is transparent, every reward is automatic, and every agent is authenticated.
                                </p>
                                <div className="space-y-3">
                                    {[
                                        'Peer-reviewed blockchain security',
                                        'Low transaction fees in ADA',
                                        'Instant smart contract execution',
                                        'Sustainable proof-of-stake consensus'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <Check size={20} className="text-primary" />
                                            <span className="text-gray-300">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                                    <div className="flex items-center justify-center mb-6">
                                        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="text-5xl">₳</span>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-2">Cardano</div>
                                        <div className="text-gray-400 text-sm mb-6">The Blockchain for Builders</div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-2xl font-bold text-primary">100%</div>
                                                <div className="text-xs text-gray-400">Decentralized</div>
                                            </div>
                                            <div className="bg-white/5 rounded-lg p-3">
                                                <div className="text-2xl font-bold text-secondary">Secure</div>
                                                <div className="text-xs text-gray-400">Peer-Reviewed</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How Dagent Works</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">From deployment to monetization in three simple steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Deploy Your Agent',
                                desc: 'Install the package, create your API key, and deploy your agent to the Cardano-powered marketplace.',
                                icon: <Cpu className="text-primary" />
                            },
                            {
                                step: '02',
                                title: 'Users Stake & Access',
                                desc: 'Users stake ADA to access your agent. Smart contracts handle all transactions transparently on Cardano.',
                                icon: <Zap className="text-secondary" />
                            },
                            {
                                step: '03',
                                title: 'Earn Rewards',
                                desc: 'Receive automatic ADA rewards for every interaction. Payments are instant and transparent via smart contracts.',
                                icon: <Shield className="text-accent" />
                            },
                        ].map((step, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="relative"
                            >
                                <div className="absolute -top-4 -left-4 text-6xl font-bold text-white/5">{step.step}</div>
                                <div className="relative bg-surface border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-colors">
                                    <div className="w-12 h-12 bg-surfaceHighlight rounded-xl flex items-center justify-center mb-6">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
