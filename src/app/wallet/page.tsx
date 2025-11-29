"use client";

import React, { useState } from 'react';
import { TrendingUp, Layers, Zap, Loader2 } from 'lucide-react';
import { useWalletBalanceQuery, useWalletTransactionsQuery, useWalletStakesQuery, useClaimRewardsMutation } from '@/hooks/useWallet';
import { MOCK_STAKES, MOCK_TRANSACTIONS } from '@/lib/constants';
import { WalletStats } from '@/lib/types';

export default function WalletPage() {
    const { data: balance, isLoading: balanceLoading } = useWalletBalanceQuery();
    const { data: transactions, isLoading: transactionsLoading } = useWalletTransactionsQuery();
    const { data: stakes, isLoading: stakesLoading } = useWalletStakesQuery();
    const claimRewardsMutation = useClaimRewardsMutation();
    
    // Use API data if available, fallback to mock
    const displayBalance = balance || { ada: 6450.25, usd: 7892.45 };
    const displayTransactions = transactions && transactions.length > 0 ? transactions : MOCK_TRANSACTIONS;
    const displayStakes = stakes && stakes.length > 0 ? stakes : MOCK_STAKES;
    
    const totalStaked = displayStakes.reduce((sum, stake) => sum + stake.amount, 0);
    const totalEarnings = displayStakes.reduce((sum, stake) => sum + stake.earned, 0);
    
    const handleClaimRewards = async (stakeId: string) => {
        try {
            await claimRewardsMutation.mutateAsync(stakeId);
        } catch (error) {
            console.error('Failed to claim rewards:', error);
        }
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
                        {balanceLoading ? (
                            <div className="flex items-center gap-3 text-gray-400">
                                <Loader2 size={24} className="animate-spin" />
                                <span>Loading balance...</span>
                            </div>
                        ) : (
                            <>
                                <div className="text-6xl font-bold font-mono tracking-tighter text-white">
                                    {displayBalance.ada.toLocaleString()} <span className="text-3xl text-primary">ADA</span>
                                </div>
                                <div className="flex items-center gap-4 text-green-400 text-sm mt-4">
                                    <span className="bg-green-500/10 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1">
                                        <TrendingUp size={14} /> +12.5%
                                    </span>
                                    <span className="text-gray-500">~${displayBalance.usd.toLocaleString()} USD</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative z-10 flex gap-4 mt-4">
                        <button className="flex-1 bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors shadow-lg">
                            Stake Tokens
                        </button>
                        <button className="flex-1 bg-white/5 text-white py-3 rounded-xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/10 backdrop-blur-md">
                            Transfer
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
                            {stakesLoading ? (
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Loading stakes...</span>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1">TOTAL STAKED</div>
                                        <div className="text-2xl font-mono font-bold">{totalStaked.toLocaleString()} ADA</div>
                                        <div className="w-full bg-white/10 h-1 mt-2 rounded-full overflow-hidden">
                                            <div className="bg-secondary w-[70%] h-full" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs mb-1">UNCLAIMED REWARDS</div>
                                        <div className="text-2xl font-mono font-bold text-primary">{totalEarnings.toLocaleString()} ADA</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => displayStakes.length > 0 && handleClaimRewards(displayStakes[0].id)}
                        disabled={claimRewardsMutation.isPending || totalEarnings === 0}
                        className="w-full py-3 bg-secondary/10 border border-secondary/30 text-secondary rounded-xl font-bold text-sm hover:bg-secondary/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {claimRewardsMutation.isPending ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Claiming...
                            </>
                        ) : (
                            'Claim Rewards'
                        )}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Stakes List */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Active Agent Stakes</h3>
                    </div>
                    {stakesLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-400 flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" /> Loading stakes...
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayStakes.map(stake => (
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
                    )}
                </div>

                {/* Activity Feed */}
                <div className="bg-surface border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg">Recent Activity</h3>
                        <button className="text-xs text-primary hover:underline">View Explorer</button>
                    </div>
                    {transactionsLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-gray-400 flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" /> Loading transactions...
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {displayTransactions.map((tx) => (
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
                    )}
                </div>
            </div>
        </div>
    );
}
