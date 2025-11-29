"use client";

import React, { useState } from 'react';
import { User, Edit, Bell, Layers, Wallet, ShieldCheck, Lock, Key, Monitor, Smartphone, Loader2 } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { DisconnectModal } from '@/components/DisconnectModal';
import { AnimatePresence } from 'framer-motion';
import { useUserProfileQuery, useNotificationSettingsQuery, useUserSessionsQuery, useUpdateNotificationsMutation } from '@/hooks/useUser';

export default function SettingsPage() {
    const { showDisconnectModal, setShowDisconnectModal, handleDisconnect } = useWallet();
    const [notifications, setNotifications] = useState({
        deploymentStatus: true,
        stakingRewards: false,
        securityAlerts: true,
    });
    
    const { data: profile, isLoading: profileLoading } = useUserProfileQuery();
    const { data: notificationSettings, isLoading: notificationsLoading } = useNotificationSettingsQuery();
    const { data: sessions, isLoading: sessionsLoading } = useUserSessionsQuery();
    const updateNotificationsMutation = useUpdateNotificationsMutation();
    
    const handleNotificationChange = async (key: keyof typeof notifications, value: boolean) => {
        const newSettings = { ...notifications, [key]: value };
        setNotifications(newSettings);
        try {
            await updateNotificationsMutation.mutateAsync(newSettings);
        } catch (error) {
            console.error('Failed to update notifications:', error);
            setNotifications(notifications); // Revert on error
        }
    };
    return (
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto w-full min-h-screen">
            <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-400 mb-12">Manage your profile, preferences, and security settings.</p>

            <div className="space-y-12">
                {/* Profile Section */}
                <section className="bg-surface border border-white/10 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <User size={20} className="text-primary" /> Profile Information
                        </h2>
                        <button className="text-xs text-primary hover:underline">Edit Profile</button>
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
                                <label className="block text-xs font-mono text-gray-500 mb-1">DISPLAY NAME</label>
                                {profileLoading ? (
                                    <div className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-400 flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin" /> Loading...
                                    </div>
                                ) : (
                                    <input type="text" value={profile?.displayName || 'NeoDev'} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-white/30" readOnly />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-1">EMAIL ADDRESS</label>
                                {profileLoading ? (
                                    <div className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-400 flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin" /> Loading...
                                    </div>
                                ) : (
                                    <input type="email" value={profile?.email || 'neo@dagent.io'} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-300 outline-none focus:border-white/30" readOnly />
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono text-gray-500 mb-1">CONNECTED WALLET</label>
                                {profileLoading ? (
                                    <div className="bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-gray-400 flex items-center gap-2">
                                        <Loader2 size={14} className="animate-spin" /> Loading wallet...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-lg p-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="font-mono text-sm text-gray-300 flex-1">{profile?.walletAddress || 'addr1q8...9sAd'}</span>
                                        <button 
                                            onClick={() => setShowDisconnectModal(true)}
                                            className="text-xs text-red-400 hover:text-red-300"
                                        >
                                            Disconnect
                                        </button>
                                    </div>
                                )}
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
                            { title: "Deployment Status", desc: "Get notified when your agents are successfully deployed.", icon: Layers },
                            { title: "Staking Rewards", desc: "Weekly summaries of your earned yields.", icon: Wallet },
                            { title: "Security Alerts", desc: "Immediate alerts for any suspicious API usage.", icon: ShieldCheck },
                        ].map((item, i) => {
                            const settingKey = i === 0 ? 'deploymentStatus' : i === 1 ? 'stakingRewards' : 'securityAlerts';
                            const isChecked = notificationSettings?.[settingKey] ?? notifications[settingKey];
                            
                            return (
                                <div key={i} className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{item.title}</div>
                                            <div className="text-xs text-gray-500">{item.desc}</div>
                                        </div>
                                    </div>
                                    {notificationsLoading ? (
                                        <Loader2 size={16} className="animate-spin text-gray-400" />
                                    ) : (
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={isChecked}
                                                onChange={(e) => handleNotificationChange(settingKey, e.target.checked)}
                                                disabled={updateNotificationsMutation.isPending}
                                            />
                                            <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary peer-disabled:opacity-50"></div>
                                        </label>
                                    )}
                                </div>
                            );
                        })}
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
                                    <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded border border-green-500/20">ENABLED</span>
                                </div>
                                <div className="font-bold mb-1">2-Factor Authentication</div>
                                <div className="text-sm text-gray-400">Your account is secured with Google Authenticator.</div>
                            </div>
                            <button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-colors">Configure</button>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/5 flex flex-col justify-between h-48">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <Key size={24} className="text-yellow-400" />
                                    <span className="text-xs bg-white/10 text-gray-400 px-2 py-1 rounded">Last changed 30d ago</span>
                                </div>
                                <div className="font-bold mb-1">API Signing Key</div>
                                <div className="text-sm text-gray-400">Used to verify CLI deployments.</div>
                            </div>
                            <button className="w-full py-2 border border-white/10 hover:bg-white/5 rounded-lg text-sm transition-colors">Rotate Key</button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">Active Sessions</h3>
                        {sessionsLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-gray-400 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin" /> Loading sessions...
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(sessions || [
                                    { id: '1', device: 'Chrome on macOS', location: 'London, UK • Active now', current: true },
                                    { id: '2', device: 'Dagent Mobile App', location: 'London, UK • 2h ago', current: false }
                                ]).map((session) => (
                                    <div key={session.id} className="flex items-center justify-between p-3 border-b border-white/5">
                                        <div className="flex items-center gap-3">
                                            {session.device.includes('Mobile') ? (
                                                <Smartphone size={18} className="text-gray-500" />
                                            ) : (
                                                <Monitor size={18} className="text-gray-500" />
                                            )}
                                            <div>
                                                <div className="text-sm font-bold">{session.device}</div>
                                                <div className="text-xs text-gray-500">{session.location || session.lastActive}</div>
                                            </div>
                                        </div>
                                        {!session.current && (
                                            <button className="text-xs text-gray-500 hover:text-white">Revoke</button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
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
