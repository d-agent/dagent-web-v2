"use client";

import React, { useState } from 'react';
import { TrendingUp, Layers, Zap } from 'lucide-react';
import { MOCK_STAKES, MOCK_TRANSACTIONS } from '@/lib/constants';
import { WalletStats } from '@/lib/types';
import { StakeModal } from '@/components/StakeModal';
import { WithdrawModal } from '@/components/WithdrawModal';
import { SuccessModal } from '@/components/SuccessModal';

export default function WalletPage() {
    const [walletStats, setWalletStats] = useState<WalletStats>({
        balance: 6450.25,
        staked: 5000.00,
        earnings: 342.10,
        apy: 12.5
    });

    const [showStakeModal, setShowStakeModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successType, setSuccessType] = useState<'stake' | 'withdraw'>('stake');
    const [successAmount, setSuccessAmount] = useState(0);

    const handleStakeSuccess = (amount: number) => {
        setWalletStats(prev => ({
            ...prev,
            balance: prev.balance - amount,
            staked: prev.staked + amount
        }));
        setShowStakeModal(false);
        setSuccessType('stake');
        setSuccessAmount(amount);
        setShowSuccessModal(true);
    };

    const handleWithdrawSuccess = (amount: number) => {
        setWalletStats(prev => ({
            ...prev,
            balance: prev.balance + amount + prev.earnings,
            staked: prev.staked - amount,
            earnings: 0
        }));
        setShowWithdrawModal(false);
        setSuccessType('withdraw');
        setSuccessAmount(amount + walletStats.earnings);
        setShowSuccessModal(true);
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto w-full min-h-screen">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Wallet</h1>
                    <p className="text-gray-400">Manage your Dagent assets and stakes.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Main Balance Card */}
                <div className="lg:col-span-2 relative h-[300px] rounded-3xl overflow-hidden p-10 flex flex-col justify-between border border-white/10 shadow-2xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#121212] to-black z-0" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                            <span className="font-pixel text-primary">DA</span>
                            DAGENT PROTOCOL
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full text-xs flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Mainnet
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="text-sm text-gray-400 mb-2">TOTAL BALANCE</div>
                        <div className="text-6xl font-bold font-mono tracking-tighter text-white">
                            {walletStats.balance.toLocaleString()} <span className="text-3xl text-primary">ADA</span>
                        </div>
                        <div className="flex items-center gap-4 text-green-400 text-sm mt-4">
                            <span className="bg-green-500/10 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1">
                                <TrendingUp size={14} /> +12.5%
                            </span>
                            <span className="text-gray-500">~$7,892.45 USD</span>
                        </div>
                    </div>

                    <div className="relative z-10 flex gap-4 mt-4">
                        <button
                            onClick={() => setShowStakeModal(true)}
                            className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg"
                        >
                            Stake Tokens
                        </button>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md"
                        >
                            Withdraw
                        </button>
                    </div>
                </div>

                {/* Staking Summary */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Layers size={20} className="text-secondary" /> Staking Rewards
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="text-gray-500 text-xs mb-1">TOTAL STAKED</div>
                                <div className="text-2xl font-mono font-bold">{walletStats.staked.toLocaleString()} ADA</div>
                                <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                                    <div className="bg-secondary w-[70%] h-full" />
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs mb-1">UNCLAIMED REWARDS</div>
                                <div className="text-2xl font-mono font-bold text-primary">{walletStats.earnings.toLocaleString()} ADA</div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setWalletStats(prev => ({ ...prev, balance: prev.balance + prev.earnings, earnings: 0 }));
                            setSuccessType('withdraw');
                            setSuccessAmount(walletStats.earnings);
                            setShowSuccessModal(true);
                        }}
                        className="w-full py-3 bg-secondary/10 border border-secondary/30 text-secondary rounded-xl font-bold text-sm hover:bg-secondary/20 transition-colors"
                    >
                        Claim Rewards
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Stakes List */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Active Agent Stakes</h3>
                    </div>
                    <div className="space-y-4">
                        {MOCK_STAKES.map(stake => (
                            <div key={stake.id} className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-surfaceHighlight rounded-lg flex items-center justify-center text-secondary">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm">{stake.agentName}</div>
                                        <div className="text-xs text-green-400 font-mono">{stake.apy}% APY</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold">{stake.amount.toLocaleString()} ADA</div>
                                    <div className="text-xs text-gray-500">Earned: {stake.earned}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Recent Activity</h3>
                        <button className="text-xs text-primary hover:underline">View Explorer</button>
                    </div>
                    <div className="space-y-6">
                        {MOCK_TRANSACTIONS.map((tx) => (
                            <div key={tx.id} className="relative pl-6 border-l border-white/10 pb-2 last:pb-0 group">
                                <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${tx.amount.startsWith('+') ? 'bg-green-500' : 'bg-gray-500'} group-hover:scale-125 transition-transform`} />
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm font-bold">{tx.type}</div>
                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                            {tx.date}
                                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                            <span className="font-mono text-[10px] text-gray-600 truncate w-24">{(tx as any).hash}</span>
                                        </div>
                                    </div>
                                    <div className={`font-mono text-sm font-bold ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                                        {tx.amount}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <StakeModal
                isOpen={showStakeModal}
                onClose={() => setShowStakeModal(false)}
                onSuccess={handleStakeSuccess}
                availableBalance={walletStats.balance}
                agentName="AlphaTrader V2"
            />

            <WithdrawModal
                isOpen={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
                onSuccess={handleWithdrawSuccess}
                stakedAmount={walletStats.staked}
                agentName="AlphaTrader V2"
                unclaimedRewards={walletStats.earnings}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                type={successType}
                amount={successAmount}
            />
        </div>
    );
}
