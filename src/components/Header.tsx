"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
    LayoutGrid,
    Terminal,
    Users,
    Wallet,
    Key,
    ChevronRight,
    Settings,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/contexts/WalletContext';
import { DisconnectModal } from '@/components/DisconnectModal';
import { AnimatePresence } from 'framer-motion';

export const Header = () => {
    const pathname = usePathname();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { isWalletConnected, showDisconnectModal, setShowDisconnectModal, handleDisconnect } = useWallet();

    // Hide header if wallet is not connected
    if (!isWalletConnected) {
        return null;
    }

    const navItems = [
        { label: 'Home', href: '/', icon: LayoutGrid },
        { label: 'Frameworks', href: '/frameworks', icon: Terminal },
        { label: 'Agents', href: '/agents', icon: Users },
        { label: 'Wallet', href: '/wallet', icon: Wallet },
        { label: 'API Keys', href: '/api-keys', icon: Key },
    ];

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl animate-in fade-in slide-in-from-top-10 duration-500">
            <div className="backdrop-blur-xl bg-black/80 border border-white/10 rounded-2xl p-2 px-4 flex items-center justify-between shadow-2xl">
                <Link href="/" className="flex items-center space-x-3 cursor-pointer">
                    <Image 
                        src="/logo.png" 
                        alt="Dagent Logo" 
                        width={48} 
                        height={48} 
                        className="w-12 h-12 object-contain"
                        priority
                        quality={90}
                        loading="eager"
                        unoptimized={false}
                    />
                </Link>

                <nav className="hidden md:flex items-center space-x-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 font-medium text-sm",
                                    isActive
                                        ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon size={16} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-surface border border-white/10 text-white hover:border-primary/50 transition-all group"
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-blue-500" />
                        <div className="flex flex-col items-start leading-none">
                            <span className="font-bold text-[10px] text-gray-400">NeoDev</span>
                            <span className="font-mono text-xs text-primary">addr1...9sAd</span>
                        </div>
                        <ChevronRight size={14} className={`text-gray-500 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
                    </button>

                    {showUserMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 z-50">
                            <Link
                                href="/settings"
                                onClick={() => setShowUserMenu(false)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2"
                            >
                                <Settings size={16} /> Settings
                            </Link>
                            <div className="h-[1px] bg-white/5 mx-2 my-1" />
                            <button
                                onClick={() => {
                                    setShowUserMenu(false);
                                    setShowDisconnectModal(true);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                                <LogOut size={16} /> Disconnect
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showDisconnectModal && (
                    <DisconnectModal
                        onClose={() => setShowDisconnectModal(false)}
                        onConfirm={handleDisconnect}
                    />
                )}
            </AnimatePresence>
        </header>
    );
};
