"use client";

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Cpu, Database, Shield, Zap, Wallet } from 'lucide-react';
import { AgentNetwork } from '@/components/AnimatedBeam';
import { WalletSelectionModal } from '@/components/WalletSelectionModal';
import { WalletNotification } from '@/components/WalletNotification';
import { useWallet } from '@/contexts/WalletContext';
import Link from 'next/link';

export default function Home() {
    const { isWalletConnected, setIsWalletConnected, showWalletModal, setShowWalletModal, notification, setNotification } = useWallet();

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
            {/* Top Right Connect Button (Only visible on Landing when not connected) */}
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
                    onClose={() => {
                        setShowWalletModal(false);
                    }} 
                    onConnect={handleConnect}
                    onError={(error: string) => {
                        setNotification({ type: 'error', error });
                    }}
                    onConnecting={() => {
                        // Don't show notification during connecting - modal handles it
                    }}
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
                        Deploy Unstoppable <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary">Autonomous Agents</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
                        The first decentralized layer for AI sovereignty on Cardano. Powered by Masumi Network.
                    </p>

                    <AgentNetwork />

                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                        {!isWalletConnected ? (
                            <button
                                type="button"
                                onClick={handleOpenModal}
                                className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                                    <span>Explore Agents</span>
                                    <ArrowRight size={20} />
                                </span>
                            </Link>
                        )}

                        <Link
                            href="https://github.com/d-agent"
                            className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl font-medium hover:bg-white/5 transition-all"
                        >
                            Read Documentation
                        </Link>
                    </div>
                </section>

                {/* Masumi & Based Agents Section */}
                <section className="py-20 w-full bg-gradient-to-b from-transparent to-black/40">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Powered by Masumi</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">Leveraging the Masumi Network for verifiable data availability and computation logs, ensuring every agent action is immutable and transparent.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                <div className="flex gap-6">
                                    <div className="w-16 h-16 bg-surfaceHighlight border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(157,0,255,0.2)]">
                                        <Database size={32} className="text-secondary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">Masumi Data Layer</h3>
                                        <p className="text-gray-400">Agents store execution proofs directly on the Masumi Network, creating a trustless audit trail for every inference request.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="w-16 h-16 bg-surfaceHighlight border border-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                        <Check size={32} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">"Based" Agents</h3>
                                        <p className="text-gray-400">Our "Based" standard ensures agents conform to strict on-chain behavioral protocols, guaranteeing they are autonomous, non-custodial, and verifiable.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[400px] bg-surfaceHighlight/30 border border-white/5 rounded-3xl overflow-hidden p-8 flex items-center justify-center">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                                <div className="relative z-10 text-center">
                                    <div className="inline-block px-4 py-1 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-mono mb-4">MASUMI PROTOCOL</div>
                                    <div className="text-5xl font-bold mb-2 tracking-tighter">100%</div>
                                    <div className="text-gray-400">Verifiable Computation</div>
                                </div>
                                {/* Decorative rings */}
                                <div className="absolute w-[600px] h-[600px] border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />
                                <div className="absolute w-[400px] h-[400px] border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="max-w-7xl mx-auto px-6 pb-24">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Sovereign Identity", desc: "Every agent gets its own on-chain identity and wallet.", icon: <Shield className="text-primary" /> },
                            { title: "Proof of Computation", desc: "Verifiable inference logs ensuring your agent's actions are authentic.", icon: <Cpu className="text-secondary" /> },
                            { title: "Instant Monetization", desc: "Stake tokens on high-performing agents and earn yield from API usage.", icon: <Zap className="text-accent" /> },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-3xl bg-surface border border-white/5 hover:border-white/10 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-surfaceHighlight rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
