"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface WalletSelectionModalProps {
    onClose: () => void;
    onConnect: () => void;
}

export const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({ onClose, onConnect }) => {
    const [isConnecting, setIsConnecting] = useState(false);

    // Mock Cardano Wallets
    const CARDANO_WALLETS = [
        { name: 'Nami', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzMyRDc0QiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTMwLjUgMjBMMjAgMTAuNSA5LjUgMjAgMjAgMjkuNSAzMC41IDIwem0tNyAwbC0zLjUtMy41LTMuNSAzLjUgMy41IDMuNSAzLjUtMy41eiIvPjwvc3ZnPg==' },
        { name: 'Eternl', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzIyMjIyMiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI2QyY2MwNyIgZD0iTTIwIDVsMTAgMTBMMjAgMjUgMTAgMTVMMjAgNXptMCAyMmw2IDZMMjAgMzdsLTYtNmw2LTZ6Ii8+PC9zdmc+' },
        { name: 'Typhon', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzAwRDJGRiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEyIDEyaDE2djE2SDEyVjEyeiIvPjwvc3ZnPg==' },
        { name: 'Flint', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0ZGMzAzMCIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEwIDEwaDIwdjIwSDEwVjEweiIvPjwvc3ZnPg==' },
    ];

    const handleWalletConnect = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnecting(false);
            onConnect();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-beam" />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-2 text-center">Connect Wallet</h2>
                <p className="text-gray-400 text-center text-sm mb-8">Select a Cardano wallet to continue.</p>

                {isConnecting ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm font-mono text-primary animate-pulse">Establishing secure connection...</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {CARDANO_WALLETS.map((wallet) => (
                            <button
                                key={wallet.name}
                                onClick={handleWalletConnect}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/50 transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-lg" />
                                    <span className="font-bold">{wallet.name}</span>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_#00ff94]" />
                            </button>
                        ))}
                    </div>
                )}

                <div className="mt-6 text-center text-xs text-gray-500">
                    By connecting, you agree to our <a href="#" className="underline hover:text-white">Terms of Service</a>
                </div>
            </motion.div>
        </div>
    );
};
