"use client";

import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { WalletNotification } from './WalletNotification';
import { useWallet } from '@/contexts/WalletContext';

export const NotificationWrapper: React.FC = () => {
    const { notification, setNotification } = useWallet();

    return (
        <AnimatePresence>
            {notification.type && (
                <WalletNotification
                    type={notification.type}
                    message={notification.message}
                    error={notification.error}
                    onClose={() => setNotification({ type: null })}
                />
            )}
        </AnimatePresence>
    );
};

