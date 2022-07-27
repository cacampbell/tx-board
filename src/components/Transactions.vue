<script setup lang="ts">
import {
  AccountId,
  Client,
  TransferTransaction,
  Hbar,
  AccountCreateTransaction,
  AccountUpdateTransaction,
} from "@hashgraph/sdk";
import { Wallet } from "../ledger/wallet";
import { useWalletStore } from "../stores/wallet";

const LEDGER_TEST_ACCOUNT = "0.0.47729388";
const walletStore = useWalletStore();

async function getClient(): Promise<Client> {
  const operator = AccountId.fromString(LEDGER_TEST_ACCOUNT);
  const client = Client.forTestnet();
  const publicKey = await walletStore.wallet?.getPublicKey(0);
  const signer = walletStore.wallet?.getTransactionSigner(0);
  client.setOperatorWith(operator, publicKey!, signer!);
  return client;
}

function handleConnectWallet(): void {
  walletStore.wallet = new Wallet();
}

async function handleVerifyAccount(): Promise<void> {
  const operator = AccountId.fromString(LEDGER_TEST_ACCOUNT);
  const client = await getClient();

  const verifyTx = new TransferTransaction()
    .addHbarTransfer(operator, Hbar.fromTinybars(0))
    .setMaxTransactionFee(Hbar.fromTinybars(1))
    .freezeWith(client);

  console.log(verifyTx);
  console.log(verifyTx.toBytes());

  await verifyTx.execute(client);
}

async function handleCreateAccount(): Promise<void> {
  const client = await getClient();

  const createTx = new AccountCreateTransaction()
    .setInitialBalance(Hbar.fromTinybars(16_789))
    .setKey(client.operatorPublicKey!)
    .setTransactionMemo("New Account!")
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(client);

  console.log(createTx);
  console.log(createTx.toBytes());

  await createTx.execute(client);
}

async function handleStakeNode(): Promise<void> {
  const client = await getClient();
  const operator = client.operatorAccountId;

  const stakeTx = new AccountUpdateTransaction()
    .setAccountId(operator!)
    .setStakedNodeId(3)
    .setDeclineStakingReward(false)
    .setTransactionMemo("Stake to Node 3")
    .setMaxTransactionFee(new Hbar(1))
    .freezeWith(client);

  console.log(stakeTx);
  console.log(stakeTx.toBytes());

  await stakeTx.execute(client);
}

async function handleStakeAccount(): Promise<void> {
  const client = await getClient();
  const operator = client.operatorAccountId;

  const stakeTx = new AccountUpdateTransaction()
    .setAccountId(operator!)
    .setStakedAccountId(AccountId.fromString("0.0.6189"))
    .setDeclineStakingReward(false)
    .setTransactionMemo("Stake to Account 6189")
    .setMaxTransactionFee(new Hbar(1))
    .freezeWith(client);

  console.log(stakeTx);
  console.log(stakeTx.toBytes());

  await stakeTx.execute(client);
}

async function handleTransferHbar(): Promise<void> {
  const client = await getClient();
  const operator = client.operatorAccountId;

  const transferTx = new TransferTransaction()
    .setTransactionMemo("Transfer 10.156 Hbar to 0.0.6189")
    .addHbarTransfer(operator!, new Hbar("-10.156"))
    .addHbarTransfer(
      AccountId.fromString("0.0.6189"),
      Hbar.fromString("10.156")
    )
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(client);

  console.log(transferTx);
  console.log(transferTx.toBytes());

  await transferTx.execute(client);
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
    <Button label="Stake to Node 3" @click="handleStakeNode" />
    <Button label="Stake to Account 6189" @click="handleStakeAccount" />
    <Button label="Transfer Hbar" @click="handleTransferHbar" />
    <Button label="Transfer Token" @click="handleTransferToken" />
    <Button label="Associate Token" @click="handleAssociateToken" />
    <Button label="DissociateToken" @click="handleDissociateToken" />
    <Button label="Mint Token" @click="handleMintToken" />
    <Button label="Burn Token" @click="handleBurnToken" />
  </div>
</template>
