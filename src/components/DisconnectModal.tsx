"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { X, LogOut, AlertTriangle } from 'lucide-react';

interface DisconnectModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export const DisconnectModal: React.FC<DisconnectModalProps> = ({ onClose, onConfirm }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="fixed top-24 left-1/2 z-[200]"
            style={{ transform: 'translateX(-50%)' }}
            role="dialog"
            aria-modal="true"
        >
            <div className="bg-[#0A0A0A] border-2 border-red-500/50 rounded-2xl p-6 w-80 h-80 shadow-[0_0_40px_rgba(239,68,68,0.3)] relative flex flex-col overflow-hidden">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center justify-center text-center space-y-5 flex-1 relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: 180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center"
                    >
                        <AlertTriangle size={40} className="text-red-500" />
                    </motion.div>
                    <div>
                        <h2 className="text-xl font-bold mb-2 text-white">Disconnect Wallet?</h2>
                        <p className="text-gray-400 text-sm leading-relaxed">You will need to reconnect to access your account.</p>
                    </div>
                </div>

                <div className="flex gap-3 mt-auto relative z-10">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} />
                        Disconnect
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
