"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, ArrowDownCircle, AlertCircle, Loader2 } from "lucide-react";
import { useStake } from "@/hooks/useStake";

interface WithdrawModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: (amount: number, txHash: string) => void;
	stakedAmount: number;
	agentName?: string;
	unclaimedRewards?: number;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({
	isOpen,
	onClose,
	onSuccess,
	stakedAmount,
	agentName = "AlphaTrader V2",
	unclaimedRewards = 0,
}) => {
	const [amount, setAmount] = useState<string>("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string>("");
	const { pullStake } = useStake();

	const gasFee = 0.12; // ADA
	const numAmount = parseFloat(amount) || 0;
	const totalReceived = numAmount + unclaimedRewards;

	const handleWithdraw = async () => {
		if (numAmount <= 0 || numAmount > stakedAmount) return;

		setIsProcessing(true);
		setError("");

		try {
			const userId = localStorage.getItem("userId") || "";
			if (!userId) {
				throw new Error("User ID not found. Please connect your wallet.");
			}

			const txHash = await pullStake({
				amount: numAmount,
				userId: userId,
			});

			setIsProcessing(false);
			onSuccess(numAmount, txHash);
		} catch (err: any) {
			console.error("Withdrawal error:", err);
			setError(err.message || "Failed to withdraw. Please try again.");
			setIsProcessing(false);
		}
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
					<div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-secondary/20">
						<ArrowDownCircle size={28} className="text-secondary" />
					</div>
					<h2 className="text-2xl font-bold mb-1">Withdraw Stake</h2>
					<p className="text-gray-400 text-sm">Withdraw from {agentName}</p>
				</div>

				{isProcessing ? (
					<div className="py-12 flex flex-col items-center justify-center">
						<Loader2 size={48} className="text-secondary animate-spin mb-4" />
						<p className="text-sm text-gray-400">Processing withdrawal...</p>
						<p className="text-xs text-gray-500 mt-2">
							Please wait while we confirm on the blockchain
						</p>
					</div>
				) : (
					<>
						<div className="mb-6">
							<label className="text-sm text-gray-400 mb-2 block">
								Amount to Withdraw
							</label>
							<div className="relative">
								<input
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									placeholder="0.00"
									max={stakedAmount}
									className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-2xl font-mono focus:outline-none focus:border-secondary/50 transition-colors"
								/>
								<span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">
									ADA
								</span>
							</div>
							<div className="flex gap-2 mt-3">
								{[100, 500, 1000, 5000].map((value) => (
									<button
										key={value}
										onClick={() =>
											setAmount(Math.min(value, stakedAmount).toString())
										}
										className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-mono transition-colors disabled:opacity-50"
										disabled={value > stakedAmount}
									>
										{value}
									</button>
								))}
							</div>
							<div className="text-xs text-gray-500 mt-2">
								Staked:{" "}
								<span className="text-white font-mono">
									{stakedAmount.toLocaleString()} ADA
								</span>
							</div>
						</div>

						<div className="bg-surfaceHighlight border border-white/5 rounded-xl p-4 mb-6 space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Withdrawal Amount</span>
								<span className="font-mono">
									{numAmount.toLocaleString()} ADA
								</span>
							</div>
							{unclaimedRewards > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-gray-400">Unclaimed Rewards</span>
									<span className="font-mono text-primary">
										+{unclaimedRewards.toLocaleString()} ADA
									</span>
								</div>
							)}
							<div className="flex justify-between text-sm">
								<span className="text-gray-400">Network Fee</span>
								<span className="font-mono text-yellow-400">-{gasFee} ADA</span>
							</div>
							<div className="border-t border-white/10 pt-3 flex justify-between">
								<span className="text-gray-400">Total Received</span>
								<div className="text-right">
									<div className="font-mono font-bold text-green-400">
										{totalReceived.toLocaleString()} ADA
									</div>
									<div className="text-xs text-gray-500">
										≈ ${(totalReceived * 0.45).toFixed(2)} USD
									</div>
								</div>
							</div>
						</div>

						{unclaimedRewards > 0 && (
							<div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
								<div className="flex items-start gap-3">
									<AlertCircle size={16} className="text-primary mt-0.5" />
									<div className="text-sm">
										<div className="text-primary font-medium mb-1">
											Rewards Included
										</div>
										<div className="text-gray-300 text-xs">
											Your unclaimed rewards will be automatically included in
											this withdrawal.
										</div>
									</div>
								</div>
							</div>
						)}

						{numAmount > stakedAmount && (
							<div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
								<AlertCircle size={16} className="text-red-500 mt-0.5" />
								<p className="text-xs text-red-400">
									Amount exceeds staked balance. Maximum: {stakedAmount} ADA
								</p>
							</div>
						)}

						{error && (
							<div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-start gap-2">
								<AlertCircle size={16} className="text-red-500 mt-0.5" />
								<p className="text-xs text-red-400">{error}</p>
							</div>
						)}

						<button
							onClick={handleWithdraw}
							disabled={numAmount <= 0 || numAmount > stakedAmount}
							className="w-full bg-secondary text-black py-4 rounded-xl font-bold hover:bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,215,0,0.3)]"
						>
							Confirm Withdrawal
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
