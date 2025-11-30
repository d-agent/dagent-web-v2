// This file is deprecated and replaced by Mesh SDK's useWallet hook
// Combined with NotificationContext for notification management
//
// Migration Guide:
// - Use: import { useWallet } from '@meshsdk/react';
// - Use: import { useNotification } from '@/contexts/NotificationContext';
//
// Old WalletContext code kept for reference only:

// "use client";

// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface NotificationState {
//     type: 'connecting' | 'success' | 'error' | 'disconnecting' | 'disconnected' | null;
//     message?: string;
//     error?: string;
// }

// interface WalletContextType {
//     isWalletConnected: boolean;
//     setIsWalletConnected: (connected: boolean) => void;
//     showWalletModal: boolean;
//     setShowWalletModal: (show: boolean) => void;
//     showDisconnectModal: boolean;
//     setShowDisconnectModal: (show: boolean) => void;
//     notification: NotificationState;
//     setNotification: (notification: NotificationState) => void;
//     handleDisconnect: () => void;
//     isDisconnecting: boolean;
// }

// const WalletContext = createContext<WalletContextType | undefined>(undefined);

// export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const router = useRouter();
//     const [isWalletConnected, setIsWalletConnected] = useState(false);
//     const [showWalletModal, setShowWalletModal] = useState(false);
//     const [showDisconnectModal, setShowDisconnectModal] = useState(false);
//     const [notification, setNotification] = useState<NotificationState>({ type: null });
//     const [isDisconnecting, setIsDisconnecting] = useState(false);

//     const handleDisconnect = () => {
//         setShowDisconnectModal(false);
//         setIsDisconnecting(true);
//         setNotification({ type: 'disconnecting', message: 'Disconnecting wallet...' });

//         // Animate disconnect
//         setTimeout(() => {
//             setIsWalletConnected(false);
//             setIsDisconnecting(false);
//             setNotification({ type: 'disconnected', message: 'Wallet disconnected successfully' });
//             router.push('/');

//             // Clear notification after redirect
//             setTimeout(() => {
//                 setNotification({ type: null });
//             }, 3000);
//         }, 1500);
//     };

//     return (
//         <WalletContext.Provider
//             value={{
//                 isWalletConnected,
//                 setIsWalletConnected,
//                 showWalletModal,
//                 setShowWalletModal,
//                 showDisconnectModal,
//                 setShowDisconnectModal,
//                 notification,
//                 setNotification,
//                 handleDisconnect,
//                 isDisconnecting,
//             }}
//         >
//             {children}
//         </WalletContext.Provider>
//     );
// };

// export const useWallet = () => {
//     const context = useContext(WalletContext);
//     if (context === undefined) {
//         throw new Error('useWallet must be used within a WalletProvider');
//     }
//     return context;
// };
