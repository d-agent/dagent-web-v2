"use client";

import React, { useState, useEffect } from "react";
import {
	User,
	Edit,
	Bell,
	Layers,
	Wallet,
	ShieldCheck,
	Lock,
	Key,
	Monitor,
	Smartphone,
} from "lucide-react";
import { useWallet } from "@meshsdk/react";
import { DisconnectModal } from "@/components/DisconnectModal";
import { AnimatePresence } from "framer-motion";

export default function SettingsPage() {
	const { wallet, connected, disconnect } = useWallet();
	const [showDisconnectModal, setShowDisconnectModal] = useState(false);
	const [walletAddress, setWalletAddress] = useState<string>("");

	// Get wallet address when connected
	useEffect(() => {
		const getWalletAddress = async () => {
			if (connected && wallet) {
				try {
					// Use getUsedAddresses() or getRewardAddresses() instead
					const addresses = await wallet.getUsedAddresses();
					if (addresses && addresses.length > 0) {
						setWalletAddress(addresses[0]);
					} else {
						// Fallback to unused addresses
						const unusedAddresses = await wallet.getUnusedAddresses();
						if (unusedAddresses && unusedAddresses.length > 0) {
							setWalletAddress(unusedAddresses[0]);
						}
					}
				} catch (error) {
					console.error("Error getting wallet address:", error);
					setWalletAddress("");
				}
			} else {
				setWalletAddress("");
			}
		};
		getWalletAddress();
	}, [connected, wallet]);

	const handleDisconnect = async () => {
		try {
			await disconnect();
			setShowDisconnectModal(false);
		} catch (error) {
			console.error("Error disconnecting wallet:", error);
		}
	};

	// Format wallet address for display
	const formatAddress = (address: string) => {
		if (!address) return "No wallet connected";
		return `${address.slice(0, 8)}...${address.slice(-4)}`;
	};
	return (
		<div className="pt-32 pb-20 px-6 max-w-5xl mx-auto w-full min-h-screen">
			<h1 className="text-4xl font-bold mb-2">Account Settings</h1>
			<p className="text-gray-400 mb-12">
				Manage your profile, preferences, and security settings.
			</p>

			<div className="space-y-12">
				{/* Profile Section */}
				<section className="bg-surface border border-white/10 rounded-3xl p-8">
					<div className="flex items-center justify-between mb-8">
						<h2 className="text-xl font-bold flex items-center gap-2">
							<User size={20} className="text-primary" /> Profile Information
						</h2>
						<button className="text-xs text-primary hover:underline">
							Edit Profile
						</button>
					</div>

					<div className="flex items-start gap-8">
						<div className="relative">
							<div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-blue-500 border-4 border-surface shadow-xl" />
							<button className="absolute bottom-0 right-0 p-2 bg-surface border border-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
								<Edit size={14} />
							</button>
						</div>
						<div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-xs font-mono text-gray-500 mb-1">
									DISPLAY NAME
								</label>
								<input
									type="text"
									value="NeoDev"
									className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-white/30"
									readOnly
								/>
							</div>
							<div>
								<label className="block text-xs font-mono text-gray-500 mb-1">
									EMAIL ADDRESS
								</label>
								<input
									type="email"
									value="neo@dagent.io"
									className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-white/30"
									readOnly
								/>
							</div>
							<div className="md:col-span-2">
								<label className="block text-xs font-mono text-gray-500 mb-1">
									CONNECTED WALLET
								</label>
								<div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-lg p-3">
									{connected ? (
										<>
											<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
											<span className="font-mono text-sm text-gray-300 flex-1">
												{formatAddress(walletAddress)}
											</span>
											<button
												onClick={() => setShowDisconnectModal(true)}
												className="text-xs text-red-400 hover:text-red-300"
											>
												Disconnect
											</button>
										</>
									) : (
										<>
											<div className="w-2 h-2 rounded-full bg-gray-500" />
											<span className="font-mono text-sm text-gray-500 flex-1">
												No wallet connected
											</span>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Notifications */}
				<section className="bg-surface border border-white/10 rounded-3xl p-8">
					<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
						<Bell size={20} className="text-secondary" /> Notifications
					</h2>
					<div className="space-y-4">
						{[
							{
								title: "Deployment Status",
								desc: "Get notified when your agents are successfully deployed.",
								icon: Layers,
							},
							{
								title: "Staking Rewards",
								desc: "Weekly summaries of your earned yields.",
								icon: Wallet,
							},
							{
								title: "Security Alerts",
								desc: "Immediate alerts for any suspicious API usage.",
								icon: ShieldCheck,
							},
						].map((item, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5"
							>
								<div className="flex items-center gap-4">
									<div className="p-2 bg-white/5 rounded-lg text-gray-400">
										<item.icon size={18} />
									</div>
									<div>
										<div className="font-bold text-sm">{item.title}</div>
										<div className="text-xs text-gray-500">{item.desc}</div>
									</div>
								</div>
								<label className="relative inline-flex items-center cursor-pointer">
									<input
										type="checkbox"
										className="sr-only peer"
										defaultChecked={i === 0 || i === 2}
									/>
									<div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
								</label>
							</div>
						))}
					</div>
				</section>

				{/* Security */}
				<section className="bg-surface border border-white/10 rounded-3xl p-8">
					<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
						<Lock size={20} className="text-accent" /> Security & Login
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex flex-col justify-between h-48">
							<div>
								<div className="flex items-center justify-between mb-4">
									<ShieldCheck size={24} className="text-green-400" />
									<span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">
										ENABLED
									</span>
								</div>
								<div className="font-bold mb-1">2-Factor Authentication</div>
								<div className="text-sm text-gray-400">
									Your account is secured with Google Authenticator.
								</div>
							</div>
							<button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-colors">
								Configure
							</button>
						</div>

						<div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex flex-col justify-between h-48">
							<div>
								<div className="flex items-center justify-between mb-4">
									<Key size={24} className="text-yellow-400" />
									<span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded">
										Last changed 30d ago
									</span>
								</div>
								<div className="font-bold mb-1">API Signing Key</div>
								<div className="text-sm text-gray-400">
									Used to verify CLI deployments.
								</div>
							</div>
							<button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-colors">
								Rotate Key
							</button>
						</div>
					</div>

					<div className="mt-8">
						<h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
							Active Sessions
						</h3>
						<div className="space-y-3">
							<div className="flex items-center justify-between p-3 border-b border-white/5">
								<div className="flex items-center gap-3">
									<Monitor size={18} className="text-gray-500" />
									<div>
										<div className="text-sm font-bold">Chrome on macOS</div>
										<div className="text-xs text-gray-500">
											London, UK • Active now
										</div>
									</div>
								</div>
								<button className="text-xs text-gray-500 hover:text-white">
									Revoke
								</button>
							</div>
							<div className="flex items-center justify-between p-3 border-b border-white/5">
								<div className="flex items-center gap-3">
									<Smartphone size={18} className="text-gray-500" />
									<div>
										<div className="text-sm font-bold">Dagent Mobile App</div>
										<div className="text-xs text-gray-500">
											London, UK • 2h ago
										</div>
									</div>
								</div>
								<button className="text-xs text-gray-500 hover:text-white">
									Revoke
								</button>
							</div>
						</div>
					</div>
				</section>
			</div>

			<AnimatePresence>
				{showDisconnectModal && (
					<DisconnectModal
						onClose={() => setShowDisconnectModal(false)}
						onConfirm={handleDisconnect}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
