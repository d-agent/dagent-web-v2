"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, ArrowDownCircle, ExternalLink } from 'lucide-react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'stake' | 'withdraw';
    amount: number;
    txHash?: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
    isOpen,
    onClose,
    type,
    amount,
    txHash = '0x7F...3a9B'
}) => {
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isStake = type === 'stake';

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            >
                {/* Background glow effect */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${isStake ? 'bg-primary' : 'bg-secondary'}/20 blur-[100px] rounded-full`} />

                <div className="relative z-10">
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="mx-auto mb-6"
                    >
                        <div className={`w-20 h-20 ${isStake ? 'bg-primary' : 'bg-secondary'}/10 rounded-full flex items-center justify-center mx-auto border-2 ${isStake ? 'border-primary' : 'border-secondary'}/30 relative`}>
                            <CheckCircle2 size={40} className={isStake ? 'text-primary' : 'text-secondary'} />
                            <motion.div
                                className={`absolute inset-0 ${isStake ? 'bg-primary' : 'bg-secondary'} rounded-full`}
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>

                    {/* Success Message */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">
                            {isStake ? 'Stake Successful!' : 'Withdrawal Complete!'}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Your transaction has been confirmed on Cardano
                        </p>
                    </div>

                    {/* Amount Display */}
                    <div className={`bg-gradient-to-br ${isStake ? 'from-primary/10 to-primary/5' : 'from-secondary/10 to-secondary/5'} border ${isStake ? 'border-primary/20' : 'border-secondary/20'} rounded-xl p-6 mb-6`}>
                        <div className="flex items-center justify-center gap-3 mb-2">
                            {isStake ? (
                                <TrendingUp size={24} className="text-primary" />
                            ) : (
                                <ArrowDownCircle size={24} className="text-secondary" />
                            )}
                            <div className="text-4xl font-bold font-mono">
                                {amount.toLocaleString()}
                                <span className={`text-xl ml-2 ${isStake ? 'text-primary' : 'text-secondary'}`}>ADA</span>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-400">
                            {isStake ? 'Now earning rewards' : 'Returned to wallet'}
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-surfaceHighlight border border-white/5 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Transaction Hash</span>
                            <a
                                href={`https://cardanoscan.io/transaction/${txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-primary hover:underline"
                            >
                                View <ExternalLink size={12} />
                            </a>
                        </div>
                        <div className="font-mono text-xs text-gray-500 bg-black/40 p-2 rounded border border-white/5">
                            {txHash}
                        </div>
                    </div>

                    {/* Info Message */}
                    {isStake && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-300">
                                <span className="text-primary font-medium">Rewards are now accruing!</span> You can view your earnings in the wallet dashboard.
                            </p>
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-bold transition-all"
                    >
                        Close
                    </button>

                    {/* Auto-close indicator */}
                    <div className="mt-4 text-center">
                        <div className="inline-flex items-center gap-2 text-xs text-gray-500">
                            <motion.div
                                className="w-1.5 h-1.5 bg-gray-500 rounded-full"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            Auto-closing in 5 seconds
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
