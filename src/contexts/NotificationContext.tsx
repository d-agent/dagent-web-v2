"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface NotificationState {
	type:
		| "connecting"
		| "success"
		| "error"
		| "disconnecting"
		| "disconnected"
		| null;
	message?: string;
	error?: string;
}

interface NotificationContextType {
	notification: NotificationState;
	setNotification: (notification: NotificationState) => void;
	showNotification: (
		type: NotificationState["type"],
		message?: string,
		error?: string
	) => void;
	clearNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [notification, setNotification] = useState<NotificationState>({
		type: null,
	});

	const showNotification = (
		type: NotificationState["type"],
		message?: string,
		error?: string
	) => {
		setNotification({ type, message, error });
	};

	const clearNotification = () => {
		setNotification({ type: null });
	};

	return (
		<NotificationContext.Provider
			value={{
				notification,
				setNotification,
				showNotification,
				clearNotification,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}
	return context;
};
