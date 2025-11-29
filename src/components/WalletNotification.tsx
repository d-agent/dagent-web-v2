"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Wallet } from 'lucide-react';

export type NotificationType = 'connecting' | 'success' | 'error' | null;

interface WalletNotificationProps {
    type: NotificationType;
    message?: string;
    error?: string;
    onClose: () => void;
    duration?: number;
}

export const WalletNotification: React.FC<WalletNotificationProps> = ({
    type,
    message,
    error,
    onClose,
    duration = 4000,
}) => {
    useEffect(() => {
        if (type && type !== 'connecting') {
            const timer = setTimeout(() => {
                onClose();
            }, type === 'success' ? 3000 : duration);
            return () => clearTimeout(timer);
        }
    }, [type, duration, onClose]);

    if (!type) return null;

    // Success notification - square top middle with green theme
    if (type === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                className="fixed top-2 left-1/2 -translate-x-1/2 z-[200]"
            >
                <div className="bg-[#0A0A0A] border-2 border-primary rounded-2xl p-8 w-80 h-80 shadow-[0_0_40px_rgba(0,255,148,0.3)] flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />

                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative z-10"
                    >
                        <CheckCircle2 size={40} className="text-primary" />
                        <motion.div
                            className="absolute inset-0 rounded-full bg-primary"
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                            style={{
                                filter: 'blur(10px)',
                            }}
                        />
                    </motion.div>
                    <div className="text-center relative z-10">
                        <h3 className="text-xl font-bold text-white mb-2">Wallet Connected</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">{message || 'Your wallet has been successfully connected.'}</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Connecting and Error - top notification bar
    const getContent = () => {
        switch (type) {
            case 'connecting':
                return {
                    icon: Wallet,
                    title: 'Connecting Wallet...',
                    message: 'Establishing secure connection to your Cardano wallet.',
                    borderColor: 'border-primary/50',
                    textColor: 'text-primary',
                };
            case 'error':
                return {
                    icon: XCircle,
                    title: 'Connection Failed',
                    message: error || message || 'Failed to connect wallet. Please try again.',
                    borderColor: 'border-red-500/50',
                    textColor: 'text-red-500',
                };
            default:
                return null;
        }
    };

    const content = getContent();
    if (!content) return null;

    const IconComponent = content.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-2 left-1/2 z-[200] w-full max-w-md px-4"
            style={{ transform: 'translateX(-50%)' }}
        >
            <div className={`bg-[#0A0A0A] border-2 ${content.borderColor} rounded-2xl p-4 shadow-2xl`}>
                <div className="flex items-center gap-3">
                    {type === 'connecting' ? (
                        <Loader2 size={20} className={`${content.textColor} animate-spin`} />
                    ) : (
                        <IconComponent size={20} className={content.textColor} />
                    )}
                    <div className="flex-1">
                        <h3 className="font-bold text-white text-sm">{content.title}</h3>
                        <p className="text-gray-400 text-xs mt-0.5">{content.message}</p>
                    </div>
                    {type !== 'connecting' && (
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <XCircle size={18} />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
