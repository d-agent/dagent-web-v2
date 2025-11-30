# Stake Contract Implementation

## Overview

Implemented the staking contract integration based on the Cardano marketplace example pattern.

## Changes Made

### 1. Updated `useStake.ts` Hook

- **Replaced** `MeshTxBuilder` with the simpler `Transaction` API from `@meshsdk/core`
- **Simplified** the `createStake` function to use `sendAssets()` method
- **Implemented** datum structure following the marketplace pattern:
  ```typescript
  const datumConstr: Data = {
  	alternative: 0,
  	fields: [
  		await StakeRedeemer.resolvePaymentKeyHash(userAddress), // seller address as pubkeyhash
  		BigInt(amount * 1_000_000), // price in lovelace
  		userId, // user ID or token
  		userId, // asset name or additional identifier
  	],
  };
  ```

### 2. Updated `contracts.ts` Utilities

- **Added** `resolvePaymentKeyHash` helper function to `StakeRedeemer` object
  - Converts Bech32 addresses to payment credential hashes
  - Returns hex string for use in datum construction

### 3. Transaction Flow

The new implementation follows this pattern:

```typescript
const tx = new Transaction({ initiator: wallet }).sendAssets(
	{
		address: scriptAddress,
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

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);
```

## Key Improvements

1. **Simpler API**: Using `Transaction.sendAssets()` is more straightforward than `MeshTxBuilder`
2. **Cleaner Code**: Reduced complexity by removing conditional logic for UTXO handling
3. **Better Structure**: Datum construction follows standard Cardano patterns
4. **Type Safety**: Using `Data` type from `@meshsdk/core` for datum construction

## Future Enhancements

1. **Pull Stake**: Implement the logic to spend from the script and withdraw stakes
2. **Get Stake**: Implement proper datum decoding to read stake information
3. **Error Handling**: Add more robust error handling and validation
4. **Testing**: Add unit tests for datum construction and transaction building

## Example Usage

```typescript
const { createStake } = useStake();

// Stake 10 ADA for user "user123"
const txHash = await createStake({
	amount: 10,
	userId: "user123",
});
```

## Notes

- The datum structure uses `alternative: 0` which corresponds to the first constructor in the Plutus validator
- All amounts are converted to lovelace (1 ADA = 1,000,000 lovelace)
- The `resolvePaymentKeyHash` function extracts the payment credential from the wallet address
- Transaction signing and submission are handled by the connected wallet
