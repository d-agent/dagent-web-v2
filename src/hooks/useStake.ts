"use client";

import { useCallback } from "react";
import {
	fetchStakeUtxo,
	scriptAddress,
	StakeRedeemer,
	loadValidator,
} from "@/lib/utils/contracts";
import { Transaction, Data } from "@meshsdk/core";
import { useWallet } from "@meshsdk/react";

export const useStake = () => {
	const { wallet, connected } = useWallet();

	const createStake = useCallback(
		async ({ amount, userId }: { amount: number; userId: string }) => {
			if (!wallet || !connected) {
				throw new Error("Wallet not connected");
			}

			// Get wallet address
			let userAddress = "";
			try {
				const usedAddresses = await wallet.getUsedAddresses();
				if (usedAddresses && usedAddresses.length > 0) {
					userAddress = usedAddresses[0];
				} else {
					const unusedAddresses = await wallet.getUnusedAddresses();
					if (unusedAddresses && unusedAddresses.length > 0) {
						userAddress = unusedAddresses[0];
					}
				}
			} catch (error) {
				console.error("Error getting wallet address:", error);
				throw new Error("Failed to get wallet address");
			}

			if (!userAddress) {
				throw new Error("No wallet address found");
			}

			console.log("Creating stake with:", { userAddress, amount, userId });

			try {
				// Get script address
				const addr = await scriptAddress("preview");
				console.log("Script address:", addr);

				// Create the datum with the staking information
				const datumConstr: Data = {
					alternative: 0,
					fields: [
						await StakeRedeemer.resolvePaymentKeyHash(userAddress), // seller address as pubkeyhash
						BigInt(amount * 1_000_000), // price in lovelace
						userId, // user ID or token
						userId, // asset name or additional identifier
					],
				};

				console.log("Datum created:", datumConstr);

				// Convert amount to lovelace
				const stakeLovelace = amount * 1_000_000;

				// Build the transaction using Transaction API
				const tx = new Transaction({ initiator: wallet }).sendAssets(
					{
						address: addr,
						datum: {
							value: datumConstr,
						},
					},
					[
						{
							unit: "lovelace",
							quantity: stakeLovelace.toString(),
						},
					]
				);

				console.log("Building transaction...");
				const unsignedTx = await tx.build();

				console.log("Signing transaction...");
				const signedTx = await wallet.signTx(unsignedTx);

				console.log("Submitting transaction...");
				const txHash = await wallet.submitTx(signedTx);

				console.log("Transaction submitted:", txHash);
				return txHash;
			} catch (error: any) {
				console.error("Detailed staking error:", error);
				throw new Error(error.message || "Failed to create stake transaction");
			}
		},
		[wallet, connected]
	);

	const pullStake = useCallback(
		async ({ amount, userId }: { amount: number; userId: string }) => {
			if (!wallet || !connected) {
				throw new Error("Wallet not connected");
			}

			// Get wallet address
			let userAddress = "";
			try {
				const usedAddresses = await wallet.getUsedAddresses();
				if (usedAddresses && usedAddresses.length > 0) {
					userAddress = usedAddresses[0];
				} else {
					const unusedAddresses = await wallet.getUnusedAddresses();
					if (unusedAddresses && unusedAddresses.length > 0) {
						userAddress = unusedAddresses[0];
					}
				}
			} catch (error) {
				console.error("Error getting wallet address:", error);
				throw new Error("Failed to get wallet address");
			}

			if (!userAddress) {
				throw new Error("No wallet address found");
			}

			try {
				// Initialize Blockfrost provider
				const blockfrostApiKey =
					process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
				if (
					!blockfrostApiKey ||
					blockfrostApiKey === "previewYourBlockfrostApiKeyHere"
				) {
					throw new Error(
						"Blockfrost API key not configured. Please add NEXT_PUBLIC_BLOCKFROST_API_KEY to your .env file"
					);
				}

				const utxo = await fetchStakeUtxo(blockfrostApiKey, "preview");
				const addr = await scriptAddress("preview");
				const validator = await loadValidator();

				if (!utxo) {
					throw new Error("No UTXO found at script address");
				}

				// Create redeemer for pulling stake
				const redeemer = await StakeRedeemer.pull(userId, amount);

				// Build the transaction to spend from script
				// This would need proper implementation with script execution
				// For now, throwing an error as it requires more complex logic
				throw new Error("Pull stake not yet fully implemented");
			} catch (error: any) {
				console.error("Detailed pull stake error:", error);
				throw new Error(error.message || "Failed to pull stake");
			}
		},
		[wallet, connected]
	);

	const getStakeByAddress = useCallback(
		async (userId: string) => {
			if (!wallet || !connected) {
				throw new Error("Wallet not connected");
			}

			try {
				const blockfrostApiKey =
					process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
				if (
					!blockfrostApiKey ||
					blockfrostApiKey === "previewYourBlockfrostApiKeyHere"
				) {
					throw new Error("Blockfrost API key not configured");
				}

				const utxo = await fetchStakeUtxo(blockfrostApiKey, "preview");

				// This needs proper implementation to decode and read datum
				// For now, returning basic structure
				return {
					user: null,
					datum: null,
				};
			} catch (error: any) {
				console.error("Error getting stake:", error);
				throw new Error(error.message || "Failed to get stake information");
			}
		},
		[wallet, connected]
	);

	return {
		createStake,
		pullStake,
		getStakeByAddress,
	};
};
