import { BlockfrostProvider } from "@meshsdk/core";

/**
 * Custom BlockfrostProvider that routes requests through our API to avoid CORS issues
 */
export class ServerSideBlockfrostProvider extends BlockfrostProvider {
	constructor(projectId: string, version = 0) {
		super(projectId, version);
	}

	/**
	 * Override the evaluateTx method to use our API route
	 */
	async evaluateTx(cbor: string): Promise<any> {
		try {
			const response = await fetch("/api/blockfrost/evaluate?network=preview", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ cbor }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to evaluate transaction");
			}

			return await response.json();
		} catch (error: any) {
			console.error("Error evaluating transaction:", error);
			throw error;
		}
	}

	/**
	 * Override fetchAddressUTxOs to use our API route
	 */
	async fetchAddressUTxOs(address: string, asset?: string): Promise<any[]> {
		try {
			const response = await fetch(
				`/api/stake/utxo?address=${encodeURIComponent(address)}&network=preview`
			);

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to fetch UTXOs");
			}

			const data = await response.json();

			if (data.utxo) {
				// Convert Blockfrost format to MeshSDK format
				return [
					{
						input: {
							txHash: data.utxo.tx_hash,
							outputIndex: data.utxo.output_index,
						},
						output: {
							address: data.utxo.address,
							amount: data.utxo.amount.map((asset: any) => ({
								unit: asset.unit,
								quantity: asset.quantity,
							})),
							plutusData: data.utxo.inline_datum || undefined,
							dataHash: data.utxo.data_hash || undefined,
						},
					},
				];
			}

			return [];
		} catch (error: any) {
			console.error("Error fetching address UTXOs:", error);
			return [];
		}
	}
}
