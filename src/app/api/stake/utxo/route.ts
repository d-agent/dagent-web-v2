import { NextRequest, NextResponse } from "next/server";

// Disable body parsing and CSRF for this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const scriptAddress = searchParams.get("address");
		const network = searchParams.get("network") || "preview";

		if (!scriptAddress) {
			return NextResponse.json(
				{ error: "Script address is required" },
				{ status: 400 }
			);
		}

		// Get Blockfrost API key from environment
		const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY;
		if (
			!blockfrostApiKey ||
			blockfrostApiKey === "previewYourBlockfrostApiKeyHere"
		) {
			return NextResponse.json(
				{ error: "Blockfrost API key not configured" },
				{ status: 500 }
			);
		}

		// Determine Blockfrost URL based on network
		const blockfrostUrl = `https://cardano-${network}.blockfrost.io/api/v0`;

		// Fetch UTXOs from Blockfrost
		const response = await fetch(
			`${blockfrostUrl}/addresses/${scriptAddress}/utxos?page=1`,
			{
				headers: {
					project_id: blockfrostApiKey,
				},
			}
		);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Blockfrost API error:", errorText);
			return NextResponse.json(
				{ error: "Failed to fetch UTXOs from Blockfrost", details: errorText },
				{ status: response.status }
			);
		}

		const utxos = await response.json();

		// Return the first UTXO or null if none found
		return NextResponse.json({
			utxo: utxos && utxos.length > 0 ? utxos[0] : null,
		});
	} catch (error: any) {
		console.error("Error fetching stake UTXO:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error.message },
			{ status: 500 }
		);
	}
}
