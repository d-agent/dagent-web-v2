import StakeAbiJson from "../config/contract/plutus.json";

let Data: any, Constr: any;
async function ensureLucidLoaded() {
	if (!Data || !Constr) {
		const lucid = await import("lucid-cardano");
		Data = lucid.Data;
		Constr = lucid.Constr;
	}
}

export async function loadValidator() {
	return {
		version: "V2" as const,
		code: StakeAbiJson.validators[2].compiledCode,
		hash: StakeAbiJson.validators[2].hash,
	};
}

export async function scriptAddress(
	network: "preprod" | "mainnet" | "preview"
) {
	// Dynamic import to avoid client-side issues
	const { resolvePlutusScriptAddress } = await import("@meshsdk/core");
	const v = await loadValidator();

	const networkId = network === "mainnet" ? 1 : 0;
	const r = resolvePlutusScriptAddress(v, networkId);
	return r;
}

export async function fetchStakeUtxo(
	blockfrostApiKey: string,
	network: "preprod" | "mainnet" | "preview"
) {
	const { BlockfrostProvider } = await import("@meshsdk/core");
	const addr = await scriptAddress(network);

	// Use Blockfrost to fetch UTXOs at the script address
	const provider = new BlockfrostProvider(blockfrostApiKey);
	const utxos = await provider.fetchAddressUTxOs(addr);

	return utxos?.[0] ?? null;
}

// Helper function to convert Bech32 address to payment credential hash
async function addressToPaymentHash(address: string): Promise<string> {
	const { C } = await import("lucid-cardano");

	try {
		// Parse the Bech32 address
		const addr = C.Address.from_bech32(address);
		const baseAddr = C.BaseAddress.from_address(addr);

		if (baseAddr) {
			// Get payment credential hash from base address
			const paymentCred = baseAddr.payment_cred();
			return Buffer.from(paymentCred.to_keyhash()?.to_bytes() || []).toString(
				"hex"
			);
		}

		// Fallback for enterprise addresses
		const enterpriseAddr = C.EnterpriseAddress.from_address(addr);
		if (enterpriseAddr) {
			const paymentCred = enterpriseAddr.payment_cred();
			return Buffer.from(paymentCred.to_keyhash()?.to_bytes() || []).toString(
				"hex"
			);
		}

		throw new Error("Unsupported address type");
	} catch (error) {
		console.error("Error converting address to payment hash:", error);
		throw new Error("Failed to convert address to payment credential hash");
	}
}

// Helper function to convert string to hex bytes
function stringToHex(str: string): string {
	return Buffer.from(str, "utf8").toString("hex");
}

export const StakeRedeemer = {
	resolvePaymentKeyHash: async (address: string) => {
		await ensureLucidLoaded();
		// Convert Bech32 address to payment credential hash and return as hex string
		const hash = await addressToPaymentHash(address);
		return hash;
	},

	create: async (
		client: string,
		provider: string,
		amount: number,
		user_id: string
	) => {
		await ensureLucidLoaded();

		// Convert Bech32 addresses to payment credential hashes
		const clientHash = await addressToPaymentHash(client);
		const providerHash = await addressToPaymentHash(provider);
		// Convert user_id string to hex bytes
		const userIdHex = stringToHex(user_id);

		// In Lucid, pass hex strings directly - they're automatically treated as ByteArrays
		return Data.to(
			new Constr(0, [clientHash, providerHash, BigInt(amount), userIdHex])
		);
	},

	pull: async (user_id: string, amount: number) => {
		await ensureLucidLoaded();
		// Convert user_id string to hex bytes
		const userIdHex = stringToHex(user_id);
		return Data.to(new Constr(2, [userIdHex, BigInt(amount)]));
	},

	get: async (user_id: string) => {
		await ensureLucidLoaded();
		// Convert user_id string to hex bytes
		const userIdHex = stringToHex(user_id);
		return Data.to(new Constr(3, [userIdHex]));
	},
};
