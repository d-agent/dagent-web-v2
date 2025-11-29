"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';

interface StakeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (amount: number) => void;
    availableBalance: number;
    agentName?: string;
}

export const StakeModal: React.FC<StakeModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    availableBalance,
    agentName = "AlphaTrader V2"
}) => {
    const [amount, setAmount] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);

    const gasFee = 0.15; // ADA
    const estimatedApy = 14.2; // %
    const numAmount = parseFloat(amount) || 0;
    const totalCost = numAmount + gasFee;
    const estimatedYearlyRewards = (numAmount * estimatedApy) / 100;

    const handleStake = async () => {
        if (numAmount <= 0 || totalCost > availableBalance) return;

        setIsProcessing(true);

        // Simulate blockchain transaction
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsProcessing(false);
        onSuccess(numAmount);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
                {!isProcessing && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                        <TrendingUp size={28} className="text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Stake Tokens</h2>
                    <p className="text-gray-400 text-sm">Stake on {agentName}</p>
                </div>

                {isProcessing ? (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <Loader2 size={48} className="text-primary animate-spin mb-4" />
                        <p className="text-sm text-gray-400">Processing transaction...</p>
                        <p className="text-xs text-gray-500 mt-2">Please wait while we confirm on the blockchain</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <label className="text-sm text-gray-400 mb-2 block">Amount to Stake</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-mono focus:outline-none focus:border-primary/50 transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">ADA</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                {[100, 500, 1000, 5000].map((value) => (
                                    <button
                                        key={value}
                                        onClick={() => setAmount(value.toString())}
                                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono transition-colors"
                                    >
                                        {value}
                                    </button>
                                ))}
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                Available: <span className="text-white font-mono">{availableBalance.toLocaleString()} ADA</span>
                            </div>
                        </div>

                        <div className="bg-surfaceHighlight border border-white/5 rounded-xl p-4 mb-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Staking Amount</span>
                                <span className="font-mono">{numAmount.toLocaleString()} ADA</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Network Fee</span>
                                <span className="font-mono text-yellow-400">{gasFee} ADA</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="text-gray-400">Total Cost</span>
                                <div className="text-right">
                                    <div className="font-mono font-bold">{totalCost.toLocaleString()} ADA</div>
                                    <div className="text-xs text-gray-500">≈ ${(totalCost * 0.45).toFixed(2)} USD</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <TrendingUp size={16} className="text-primary mt-0.5" />
                                <div className="text-sm">
                                    <div className="text-primary font-medium mb-1">Estimated Rewards</div>
                                    <div className="text-gray-300">
                                        <span className="font-mono font-bold text-primary">{estimatedYearlyRewards.toFixed(2)} ADA</span> per year
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">APY: {estimatedApy}%</div>
                                </div>
                            </div>
                        </div>

                        {totalCost > availableBalance && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
                                <AlertCircle size={16} className="text-red-500 mt-0.5" />
                                <p className="text-xs text-red-400">Insufficient balance. You need {(totalCost - availableBalance).toFixed(2)} more ADA.</p>
                            </div>
                        )}

                        <button
                            onClick={handleStake}
                            disabled={numAmount <= 0 || totalCost > availableBalance}
                            className="w-full bg-primary text-black py-4 rounded-xl font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,255,148,0.3)]"
                        >
                            Confirm Stake
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Transaction will be processed on Cardano mainnet
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
};
