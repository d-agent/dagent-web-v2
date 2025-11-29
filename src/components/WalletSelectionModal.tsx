"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Wallet } from 'lucide-react';

interface WalletSelectionModalProps {
    onClose: () => void;
    onConnect: () => void;
    onConnecting?: () => void;
    onError?: (error: string) => void;
}

export const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({ 
    onClose, 
    onConnect, 
    onConnecting,
    onError 
}) => {
    const [isConnecting, setIsConnecting] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Mock Cardano Wallets
    const CARDANO_WALLETS = [
        { name: 'Nami', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzMyRDc0QiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTMwLjUgMjBMMjAgMTAuNSA5LjUgMjAgMjAgMjkuNSAzMC41IDIwem0tNyAwbC0zLjUtMy41LTMuNSAzLjUgMy41IDMuNSAzLjUtMy41eiIvPjwvc3ZnPg==' },
        { name: 'Eternl', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzIyMjIyMiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI2QyY2MwNyIgZD0iTTIwIDVsMTAgMTBMMjAgMjUgMTAgMTVMMjAgNXptMCAyMmw2IDZMMjAgMzdsLTYtNmw2LTZ6Ii8+PC9zdmc+' },
        { name: 'Typhon', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iIzAwRDJGRiIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEyIDEyaDE2djE2SDEyVjEyeiIvPjwvc3ZnPg==' },
        { name: 'Flint', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHBhdGggZmlsbD0iI0ZGMzAzMCIgZD0iTTAgMGg0MHY0MEgwVjB6Ii8+PHBhdGggZmlsbD0iI0ZGRiIgZD0iTTEwIDEwaDIwdjIwSDEwVjEweiIvPjwvc3ZnPg==' },
    ];

    const handleWalletConnect = () => {
        setIsConnecting(true);
        onConnecting?.();
        
        // Simulate wallet connection
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% success rate
            if (success) {
                setIsConnecting(false);
                onConnect();
            } else {
                setIsConnecting(false);
                onError?.("User denied access or connection timed out.");
            }
        }, 2000);
    };

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isConnecting) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-modal-title"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
                {!isConnecting && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                {isConnecting ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="relative"
                        >
                            <Wallet size={32} className="text-primary" />
                            <motion.div
                                className="absolute inset-0 bg-primary rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                style={{
                                    filter: 'blur(8px)',
                                }}
                            />
                        </motion.div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-primary">Connecting...</p>
                            <p className="text-xs text-gray-400">Please approve in your wallet</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h2 id="wallet-modal-title" className="text-xl font-bold mb-1">Connect Wallet</h2>
                            <p className="text-gray-400 text-sm">Select a Cardano wallet to continue</p>
                        </div>

                        <div className="space-y-2">
                            {CARDANO_WALLETS.map((wallet) => (
                                <button
                                    key={wallet.name}
                                    onClick={handleWalletConnect}
                                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/50 transition-all group"
                                >
                                    <img src={wallet.icon} alt={wallet.name} className="w-8 h-8 rounded-lg" />
                                    <span className="font-medium flex-1 text-left">{wallet.name}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>

                        <p className="mt-6 text-center text-xs text-gray-500">
                            By connecting, you agree to our <a href="#" className="underline hover:text-white">Terms</a>
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
};
