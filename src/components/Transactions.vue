<script setup lang="ts">
import {
  AccountId,
  Client,
  TransferTransaction,
  Hbar,
  Transaction,
  TransactionId,
} from "@hashgraph/sdk";
import { Wallet } from "../ledger/wallet";
import { useWalletStore } from "../stores/wallet";

const LEDGER_TEST_ACCOUNT = "0.0.47729388";
const walletStore = useWalletStore();

function handleConnectWallet(): void {
  walletStore.wallet = new Wallet();
}

async function handleVerifyAccount(): Promise<void> {
  const operator = AccountId.fromString(LEDGER_TEST_ACCOUNT);
  const client = Client.forTestnet();

  const verifyTx = new TransferTransaction()
    .setTransactionId(TransactionId.generate(operator))
    .addHbarTransfer(operator, Hbar.fromTinybars(0))
    .setMaxTransactionFee(Hbar.fromTinybars(1))
    .setTransactionMemo(`Verify ${LEDGER_TEST_ACCOUNT}`)
    .freezeWith(client);

  console.log(verifyTx);
  console.log(verifyTx.toBytes());

  const signedBytes = await walletStore.wallet?.getTransactionSigner(0)(
    verifyTx.toBytes()
  );

  if (signedBytes != null) {
    const signedTx = Transaction.fromBytes(signedBytes);
    await signedTx.execute(client);
  }
}

function handleCreateAccount(): void {
  console.log("handleCreateAccount");
}

function handleUpdateAccount(): void {
  console.log("handleUpdateAccount");
}

function handleTransferHbar(): void {
  console.log("handleTransferHbar");
}

function handleTransferToken(): void {
  console.log("handleTransferToken");
}

function handleAssociateToken(): void {
  console.log("handleAssociateToken");
}

function handleDissociateToken(): void {
  console.log("handleDissociateToken");
}

function handleMintToken(): void {
  console.log("handleMintToken");
}

function handleBurnToken(): void {
  console.log("handleBurnToken");
}
</script>

<template>
  <div class="grid grid-cols-2">
    <Button label="Connect Wallet" @click="handleConnectWallet" />
    <Button label="Verify Account" @click="handleVerifyAccount" />
    <Button label="Create Account" @click="handleCreateAccount" />
    <Button label="Update Account" @click="handleUpdateAccount" />
    <Button label="Transfer Hbar" @click="handleTransferHbar" />
    <Button label="Transfer Token" @click="handleTransferToken" />
    <Button label="Associate Token" @click="handleAssociateToken" />
    <Button label="DissociateToken" @click="handleDissociateToken" />
    <Button label="Mint Token" @click="handleMintToken" />
    <Button label="Burn Token" @click="handleBurnToken" />
  </div>
</template>
