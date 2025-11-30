import { NextRequest, NextResponse } from "next/server";

// Disable body parsing and CSRF for this API route
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const network = searchParams.get("network") || "preview";

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

		// Get the request body (CBOR hex)
		const body = await request.json();

		// Determine Blockfrost URL based on network
		const blockfrostUrl = `https://cardano-${network}.blockfrost.io/api/v0`;

		// Forward the request to Blockfrost
		const response = await fetch(`${blockfrostUrl}/utils/txs/evaluate/utxos`, {
			method: "POST",
			headers: {
				project_id: blockfrostApiKey,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Blockfrost evaluate error:", errorText);
			return NextResponse.json(
				{ error: "Failed to evaluate transaction", details: errorText },
				{ status: response.status }
			);
		}

		const result = await response.json();
		return NextResponse.json(result);
	} catch (error: any) {
		console.error("Error evaluating transaction:", error);
		return NextResponse.json(
			{ error: "Internal server error", details: error.message },
			{ status: 500 }
		);
	}
}
