"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Wallet, Download, ExternalLink, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { BrowserWallet } from '@meshsdk/core';
import { useGetNonce, useVerifySignature } from '@/hooks/useAuth';
import api from '@/lib/api';

interface WalletSelectionModalProps {
    onClose: () => void;
    onConnect: (address?: string) => void;
    onConnecting?: () => void;
    onError?: (error: string) => void;
}

interface CardanoWallet {
    name: string;
    displayName: string;
    icon: string;
    downloadUrl: string;
    isInstalled: boolean;
    alternativeIds: string[];
    detectedId?: string;
}

export const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
    onClose,
    onConnect,
    onConnecting,
    onError
}) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
    const [availableWallets, setAvailableWallets] = useState<CardanoWallet[]>([]);
    const [currentStep, setCurrentStep] = useState<string>('');
    const [isDetecting, setIsDetecting] = useState(true);
    
    const getNonceMutation = useGetNonce();
    const verifySignatureMutation = useVerifySignature();

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const CARDANO_WALLETS_INFO = [
        { name: 'nami', displayName: 'Nami', icon: '', downloadUrl: 'https://www.namiwallet.io/', alternativeIds: [] },
        { name: 'eternl', displayName: 'Eternl', icon: '', downloadUrl: 'https://eternl.io/', alternativeIds: ['ccvaultio'] },
        { name: 'flint', displayName: 'Flint', icon: '', downloadUrl: 'https://flint-wallet.com/', alternativeIds: [] },
        { name: 'typhoncip30', displayName: 'Typhon', icon: '', downloadUrl: 'https://typhonwallet.io/', alternativeIds: ['typhon'] },
        { name: 'gerowallet', displayName: 'Gero', icon: '', downloadUrl: 'https://gerowallet.io/', alternativeIds: [] },
        { name: 'lace', displayName: 'Lace', icon: '', downloadUrl: 'https://www.lace.io/', alternativeIds: [] },
    ];

    useEffect(() => {
        detectWalletsWithRetry();
    }, []);

    const detectWalletsWithRetry = async () => {
        setIsDetecting(true);
        let foundWallets = detectWallets();

        if (foundWallets === 0) {
            const delays = [500, 1000, 2000];
            for (let i = 0; i < delays.length; i++) {
                await new Promise(resolve => setTimeout(resolve, delays[i]));
                foundWallets = detectWallets();
                if (foundWallets > 0) break;
            }
        }
        setIsDetecting(false);
    };

    const detectWallets = (): number => {
        try {
            const installedWalletObjects = BrowserWallet.getInstalledWallets();
            const installedWalletIds = installedWalletObjects.map((w: any) => w.id);

            console.log('✅ Detected wallet IDs:', installedWalletIds);

            const wallets: CardanoWallet[] = CARDANO_WALLETS_INFO.map(walletInfo => {
                const allPossibleIds = [walletInfo.name, ...walletInfo.alternativeIds];
                const matchingId = allPossibleIds.find(id => installedWalletIds.includes(id));
                const isInstalled = !!matchingId;

                const installedWallet = installedWalletObjects.find((w: any) =>
                    allPossibleIds.includes(w.id)
                );
                const icon = installedWallet?.icon || `https://ui-avatars.com/api/?name=${walletInfo.displayName}&background=random`;

                return {
                    ...walletInfo,
                    icon,
                    isInstalled,
                    detectedId: matchingId || walletInfo.name
                };
            });

            setAvailableWallets(wallets);
            const count = wallets.filter(w => w.isInstalled).length;
            console.log(`✅ Found ${count} installed wallet(s)`);
            return count;
        } catch (error) {
            console.error('Error detecting wallets:', error);
            return 0;
        }
    };

    const handleRefreshWallets = () => {
        detectWalletsWithRetry();
    };

    const handleWalletConnect = async (walletName: string) => {
        setIsConnecting(true);
        setConnectingWallet(walletName);
        onConnecting?.();

        try {
            const walletInfo = availableWallets.find(w => w.name === walletName);
            const walletIdToConnect = walletInfo?.detectedId || walletName;

            console.log(`🔌 Connecting to wallet: ${walletInfo?.displayName} (ID: ${walletIdToConnect})`);

            setCurrentStep('Connecting to wallet...');
            const wallet = await BrowserWallet.enable(walletIdToConnect as any);

            setCurrentStep('Getting wallet address...');

            let userAddress: string | undefined;

            try {
                const usedAddresses = await wallet.getUsedAddresses();
                if (usedAddresses && usedAddresses.length > 0) {
                    userAddress = usedAddresses[0];
                    console.log('✅ Got address from getUsedAddresses');
                }
            } catch (e) {
                console.log('⚠️ getUsedAddresses failed, trying alternatives...');
            }

            if (!userAddress) {
                try {
                    const unusedAddresses = await wallet.getUnusedAddresses();
                    if (unusedAddresses && unusedAddresses.length > 0) {
                        userAddress = unusedAddresses[0];
                        console.log('✅ Got address from getUnusedAddresses');
                    }
                } catch (e) {
                    console.log('⚠️ getUnusedAddresses failed');
                }
            }

            if (!userAddress) {
                try {
                    userAddress = await wallet.getChangeAddress();
                    console.log('✅ Got address from getChangeAddress');
                } catch (e) {
                    console.log('⚠️ getChangeAddress failed');
                }
            }

            if (!userAddress) {
                throw new Error('No address found in wallet. Please make sure your wallet has at least one address.');
            }

            console.log('User address:', userAddress);
            setCurrentStep('Requesting authentication nonce...');

            const nonceResponse = await getNonceMutation.mutateAsync(userAddress);
            const nonce = (nonceResponse as any).nonce;
            console.log('Nonce received:', nonce);

            setCurrentStep('Please sign the message in your wallet...');
            const signature = await wallet.signData(nonce, userAddress);

            console.log('Message signed:', signature);
            setCurrentStep('Verifying signature...');

            await verifySignatureMutation.mutateAsync({
                address: userAddress,
                signature: signature
            });

            console.log('Authentication successful!');
            setCurrentStep('Success!');

            setTimeout(() => {
                setIsConnecting(false);
                setConnectingWallet(null);
                onConnect(userAddress);
            }, 500);

        } catch (error: any) {
            console.error('❌ Wallet connection error:', error);
            console.error('❌ Error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                status: error.response?.status
            });

            setIsConnecting(false);
            setConnectingWallet(null);
            setCurrentStep('');

            let errorMessage = 'Failed to connect wallet';

            if (error.message?.includes('User declined')) {
                errorMessage = 'Connection request was declined';
            } else if (error.message?.includes('No address found')) {
                errorMessage = 'No address found in wallet. Please make sure your wallet has at least one address.';
            } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                errorMessage = 'Cannot connect to authentication server. Check if backend is running.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Backend endpoint not found. Check API URL.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Server error. Try again later.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Authentication failed';
            } else if (error.message) {
                errorMessage = error.message;
            }

            onError?.(errorMessage);
        }
    };

    const installedWallets = availableWallets.filter(w => w.isInstalled);
    const notInstalledWallets = availableWallets.filter(w => !w.isInstalled);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isConnecting) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-modal-title"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
                {!isConnecting && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                )}

                {isConnecting ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-4">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="relative"
                        >
                            <Wallet size={32} className="text-primary" />
                            <motion.div
                                className="absolute inset-0 bg-primary rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.3, 0, 0.3],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeOut"
                                }}
                                style={{
                                    filter: 'blur(8px)',
                                }}
                            />
                        </motion.div>
                        <div className="text-center space-y-1">
                            <p className="text-sm font-medium text-primary">
                                {connectingWallet ? `Connecting to ${availableWallets.find(w => w.name === connectingWallet)?.displayName}...` : 'Connecting...'}
                            </p>
                            <p className="text-xs text-gray-400">{currentStep}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h2 id="wallet-modal-title" className="text-xl font-bold mb-1">Connect Wallet</h2>
                            <p className="text-gray-400 text-sm">Select a Cardano wallet to continue</p>
                        </div>

                        {isDetecting && (
                            <div className="flex items-center justify-center gap-2 mb-4 text-xs text-gray-500">
                                <RefreshCw size={12} className="animate-spin" />
                                <span>Detecting wallets...</span>
                            </div>
                        )}

                        {installedWallets.length > 0 && (
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-primary" />
                                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Installed Wallets</p>
                                    </div>
                                    <button
                                        onClick={handleRefreshWallets}
                                        className="text-xs text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                                        disabled={isDetecting}
                                    >
                                        <RefreshCw size={12} className={isDetecting ? 'animate-spin' : ''} />
                                        Refresh
                                    </button>
                                </div>
                                {installedWallets.map((wallet) => (
                                    <button
                                        key={wallet.name}
                                        onClick={() => handleWalletConnect(wallet.name)}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/50 transition-all group"
                                    >
                                        <img src={wallet.icon} alt={wallet.displayName} className="w-8 h-8 rounded-lg object-cover" />
                                        <span className="font-medium flex-1 text-left">{wallet.displayName}</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {notInstalledWallets.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2 mt-6">
                                    <Download size={14} className="text-gray-500" />
                                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Available Wallets</p>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">Install one of these wallets to get started</p>
                                {notInstalledWallets.map((wallet) => (
                                    <a
                                        key={wallet.name}
                                        href={wallet.downloadUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                            <Wallet size={16} className="text-gray-500" />
                                        </div>
                                        <span className="font-medium flex-1 text-left text-gray-500 group-hover:text-gray-300 transition-colors">{wallet.displayName}</span>
                                        <ExternalLink size={14} className="text-gray-600 group-hover:text-primary transition-colors" />
                                    </a>
                                ))}
                            </div>
                        )}

                        {!isDetecting && installedWallets.length === 0 && (
                            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm">
                                        <p className="text-yellow-500 font-medium mb-1">No Cardano Wallets Detected</p>
                                        <p className="text-gray-400 text-xs mb-2">Please install a Cardano wallet extension to connect.</p>
                                        <button
                                            onClick={handleRefreshWallets}
                                            className="text-xs text-primary hover:underline flex items-center gap-1"
                                        >
                                            <RefreshCw size={12} />
                                            Try again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="mt-6 text-center text-xs text-gray-500">
                            By connecting, you agree to our <a href="#" className="underline hover:text-white">Terms</a>
                        </p>
                    </>
                )}
            </motion.div>
        </div>
    );
};
