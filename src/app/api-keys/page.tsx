"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Key, Copy, MoreVertical, Edit, Ban, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_API_KEYS } from '@/lib/constants';

export default function ApiKeysPage() {
    const [isCreating, setIsCreating] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen w-full" onClick={() => setActiveDropdown(null)}>
            <h1 className="text-4xl font-bold mb-8">API Keys</h1>

            {/* Full width Chart */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6 mb-8 w-full shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Usage Overview (Requests)</h3>
                    <select className="bg-black border border-white/10 rounded px-3 py-1 text-xs outline-none">
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </select>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { name: 'Mon', reqs: 4000 }, { name: 'Tue', reqs: 3000 }, { name: 'Wed', reqs: 2000 },
                            { name: 'Thu', reqs: 2780 }, { name: 'Fri', reqs: 1890 }, { name: 'Sat', reqs: 2390 }, { name: 'Sun', reqs: 3490 }
                        ]}>
                            <defs>
                                <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00FF94" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 12 }} />
                            <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#00FF94' }}
                            />
                            <Area type="monotone" dataKey="reqs" stroke="#00FF94" fillOpacity={1} fill="url(#colorReqs)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Content Area - Full Width */}
            {isCreating ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-xl">Create New API Key</h3>
                        <button onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-gray-500 font-mono mb-2 block">KEY NAME</label>
                            <input type="text" className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm focus:border-primary outline-none text-white" placeholder="e.g. Production Mobile App" />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button onClick={() => setIsCreating(false)} className="flex-1 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-bold">Cancel</button>
                            <button className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primaryDim transition-colors text-sm">Generate Secret Key</button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-6 w-full">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-xl">Active Keys</h3>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center space-x-2 bg-primary text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-primaryDim transition-colors"
                        >
                            <Plus size={16} /> <span>Create New Key</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {MOCK_API_KEYS.map(key => (
                            <div key={key.id} className="bg-surface border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between hover:border-white/20 transition-colors group w-full shadow-md">
                                {/* Key Item content */}
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="w-12 h-12 bg-surfaceHighlight border border-white/5 rounded-xl flex items-center justify-center text-primary shadow-[0_0_15px_rgba(0,255,148,0.1)]">
                                        <Key size={24} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg mb-1">{key.name}</div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">{key.prefix}</span>
                                            <span className="text-xs text-gray-500">• Created {key.createdAt}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                    <div className="text-right hidden md:block">
                                        <div className="text-xs text-gray-500 mb-1">Last Used</div>
                                        <div className="text-sm font-mono text-gray-300">{key.lastUsed}</div>
                                    </div>

                                    <div className="flex items-center gap-2 relative">
                                        <button className="flex items-center space-x-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-colors">
                                            <Copy size={14} /> <span>Copy</span>
                                        </button>

                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveDropdown(activeDropdown === key.id ? null : key.id);
                                                }}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                            >
                                                <MoreVertical size={20} />
                                            </button>

                                            {/* Dropdown Menu */}
                                            <AnimatePresence>
                                                {activeDropdown === key.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute right-0 top-full mt-2 w-48 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 origin-top-right"
                                                    >
                                                        <button className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2">
                                                            <Edit size={16} /> Edit Permissions
                                                        </button>
                                                        <button className="w-full text-left px-4 py-3 text-sm text-yellow-500 hover:bg-yellow-500/10 flex items-center gap-2">
                                                            <Ban size={16} /> Revoke Key
                                                        </button>
                                                        <div className="h-[1px] bg-white/5 mx-2 my-1" />
                                                        <button className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                                                            <Trash2 size={16} /> Delete Permanently
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
