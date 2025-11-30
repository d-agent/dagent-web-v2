"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import { WalletNotification } from "./WalletNotification";
import { useNotification } from "@/contexts/NotificationContext";

export const NotificationWrapper: React.FC = () => {
	const { notification, clearNotification } = useNotification();

	return (
		<AnimatePresence>
			{notification.type && (
				<WalletNotification
					type={notification.type}
					message={notification.message}
					error={notification.error}
					onClose={clearNotification}
				/>
			)}
		</AnimatePresence>
	);
};
