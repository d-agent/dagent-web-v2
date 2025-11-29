"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
    isWalletConnected: boolean;
    setIsWalletConnected: (connected: boolean) => void;
    showWalletModal: boolean;
    setShowWalletModal: (show: boolean) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [showWalletModal, setShowWalletModal] = useState(false);

    return (
        <WalletContext.Provider
            value={{
                isWalletConnected,
                setIsWalletConnected,
                showWalletModal,
                setShowWalletModal,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a WalletProvider');
    }
    return context;
};

