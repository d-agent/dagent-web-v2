"use client";

import { useCallback } from "react";
import {
	fetchStakeUtxo,
	scriptAddress,
	StakeRedeemer,
	loadValidator,
} from "@/lib/utils/contracts";
import { ServerSideBlockfrostProvider } from "@/lib/utils/blockfrost-provider";
import { MeshTxBuilder } from "@meshsdk/core";
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
				// Initialize Blockfrost provider first
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

				console.log("Script address:", addr);
				console.log("UTXO found:", utxo);

				const redeemer = await StakeRedeemer.create(
					userAddress,
					addr,
					amount,
					userId
				);

				console.log("Redeemer created:", redeemer);

				const provider = new ServerSideBlockfrostProvider(blockfrostApiKey);

				const txBuilder = new MeshTxBuilder({
					fetcher: provider,
					submitter: wallet,
					evaluator: provider,
				});

				if (utxo) {
					console.log("Building transaction to spend existing UTXO...");
					console.log("UTXO details:", JSON.stringify(utxo, null, 2));

					// Calculate new total amount at script (existing + new stake)
					// Convert amount to lovelace (1 ADA = 1,000,000 lovelace)
					const newStakeLovelace = amount * 1_000_000;

					// Get existing amount from UTXO
					const existingLovelace = parseInt(utxo.output.amount[0].quantity);
					const totalLovelace = existingLovelace + newStakeLovelace;

					console.log("Existing at script:", existingLovelace, "lovelace");
					console.log("Adding stake:", newStakeLovelace, "lovelace");
					console.log("Total to return:", totalLovelace, "lovelace");

					// Get wallet UTXOs to fund the transaction
					const walletUtxos = await wallet.getUtxos();
					console.log("Wallet has", walletUtxos.length, "UTXOs available");

					// Check if the UTXO has inline datum or datum hash
					const hasInlineDatum = utxo.output.plutusData !== undefined;
					const hasDatumHash = utxo.output.dataHash !== undefined;

					console.log("Has inline datum:", hasInlineDatum);
					console.log("Has datum hash:", hasDatumHash);

					// Correct order: txIn -> declare script type -> provide script -> redeemer
					txBuilder
						.txIn(
							utxo.input.txHash,
							utxo.input.outputIndex,
							utxo.output.amount,
							utxo.output.address
						)
						.spendingPlutusScriptV2() // Declare it's Plutus V2 FIRST
						.txInScript(validator.code) // THEN provide the script code
						.txInRedeemerValue(redeemer) // THEN the redeemer
						.txOut(addr, [
							{ unit: "lovelace", quantity: totalLovelace.toString() },
						])
						.txOutInlineDatumValue(redeemer)
						.selectUtxosFrom(walletUtxos)
						.changeAddress(userAddress);
				} else {
					// No UTXO at script address yet - this is the first stake
					// We need to create an initial datum and send funds to the script
					console.log("No UTXO found - creating initial stake...");

					// Convert amount to lovelace
					const stakeLovelace = amount * 1_000_000;

					// Get wallet UTXOs to fund the transaction
					const walletUtxos = await wallet.getUtxos();
					console.log("Wallet has", walletUtxos.length, "UTXOs available");
					console.log("Sending", stakeLovelace, "lovelace to script address");

					// Build transaction to send funds to script with inline datum
					txBuilder
						.txOut(addr, [
							{ unit: "lovelace", quantity: stakeLovelace.toString() },
						])
						.txOutInlineDatumValue(redeemer) // Set the redeemer as initial datum
						.selectUtxosFrom(walletUtxos)
						.changeAddress(userAddress);
				}

				console.log("Completing transaction...");
				const unsignedTx = await txBuilder.complete();

				console.log("Signing transaction...");
				const signedTx = await wallet.signTx(unsignedTx, true);

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

			// Initialize Blockfrost provider
			const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
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

			const redeemer = await StakeRedeemer.pull(userId, amount);

			const provider = new ServerSideBlockfrostProvider(blockfrostApiKey);

			const txBuilder = new MeshTxBuilder({
				fetcher: provider,
				submitter: wallet,
				evaluator: provider,
			});

			if (utxo) {
				txBuilder
					.txIn(
						utxo.input.txHash,
						utxo.input.outputIndex,
						utxo.output.amount,
						utxo.output.address
					)
					// Declare this is a Plutus V2 script input
					.spendingPlutusScriptV2()
					// Provide the script code
					.txInScript(validator.code)
					// Indicate inline datum is present
					.txInInlineDatumPresent()
					// Provide the redeemer
					.txInRedeemerValue(redeemer)
					.txOut(addr, utxo.output.amount)
					.txOutInlineDatumValue(utxo.output.plutusData || "")
					.changeAddress(userAddress);
			}

			const unsignedTx = await txBuilder.complete();
			const signedTx = await wallet.signTx(unsignedTx, true);
			const txHash = await wallet.submitTx(signedTx);

			return txHash;
		},
		[wallet, connected]
	);

	const getStakeByAddress = useCallback(
		async (userId: string) => {
			if (!wallet || !connected) {
				throw new Error("Wallet not connected");
			}

			const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
			if (
				!blockfrostApiKey ||
				blockfrostApiKey === "previewYourBlockfrostApiKeyHere"
			) {
				throw new Error("Blockfrost API key not configured");
			}

			const redeemer = await StakeRedeemer.get(userId);
			console.log("GetStake redeemer:", redeemer);

			const utxo = await fetchStakeUtxo(blockfrostApiKey, "preview");

			// Check if UTXO exists
			if (!utxo) {
				console.log("No UTXO found at script address - no stakes yet");
				return {
					user: null,
					datum: redeemer,
				};
			}

			// Check if the UTXO has plutus data (datum)
			if (!utxo.output.plutusData) {
				console.log("UTXO found but no datum present");
				return {
					user: null,
					datum: redeemer,
				};
			}

			// For now, return the raw datum since we need to properly decode it
			// TODO: Implement proper datum decoding to extract stakes array
			console.log("UTXO datum:", utxo.output.plutusData);

			return {
				user: null, // Will be populated once datum decoding is implemented
				datum: redeemer,
				rawDatum: utxo.output.plutusData,
			};
		},
		[wallet, connected]
	);

	return {
		createStake,
		pullStake,
		getStakeByAddress,
	};
};
