<script setup lang="ts">
import {
  AccountId,
  PrivateKey,
  PublicKey,
  TokenType,
  Client,
  TransferTransaction,
  Hbar,
  AccountCreateTransaction,
  AccountUpdateTransaction,
  TokenCreateTransaction,
  TokenSupplyType,
  TokenAssociateTransaction,
  TokenDissociateTransaction,
  TokenMintTransaction,
  TokenBurnTransaction,
} from "@hashgraph/sdk";
import { Wallet } from "../ledger/wallet";
import { useTokenStore } from "../stores/token";
import { useWalletStore } from "../stores/wallet";

const LEDGER_TEST_ACCOUNT = "0.0.47729388";
const LEDGER_PUBLIC_KEY =
  "bf4028caa14379a7cef89b0f86894880a6dc31281edf5d0081259d2d36ef01e1";
const ACCOUNT_6189_PRIVATE_KEY =
  "302e020100300506032b6570042204207f7ac6c8025a15ff1e07ef57c7295601379a4e9a526560790ae85252393868f0";
const walletStore = useWalletStore();

async function getClient(): Promise<Client> {
  const operator = AccountId.fromString(LEDGER_TEST_ACCOUNT);
  const client = Client.forTestnet();
  const publicKey = await walletStore.wallet?.getPublicKey(0);
  const signer = walletStore.wallet?.getTransactionSigner(0);
  client.setOperatorWith(operator, publicKey!, signer!);
  return client;
}

async function handleCreateToken(): Promise<void> {
  const tokenStore = useTokenStore();

  const client = Client.forTestnet().setOperator(
    AccountId.fromString("0.0.6189"),
    PrivateKey.fromString(ACCOUNT_6189_PRIVATE_KEY)
  );

  const createTokenTx = new TokenCreateTransaction()
    .setTokenName("STAR")
    .setTokenSymbol("*")
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(6)
    .setInitialSupply(200)
    .setTreasuryAccountId(AccountId.fromString("0.0.6189"))
    .setSupplyType(TokenSupplyType.Infinite)
    .setAdminKey(PrivateKey.fromString(ACCOUNT_6189_PRIVATE_KEY))
    .setSupplyKey(PublicKey.fromString(LEDGER_PUBLIC_KEY))
    .freezeWith(client);

  const executedTx = await createTokenTx.execute(client);
  const receipt = await executedTx.getReceipt(client);

  console.log(receipt);
  tokenStore.token = receipt.tokenId;
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

async function handleTransferToken(): Promise<void> {
  const tokenStore = useTokenStore();
  const tokenId = tokenStore.token;
  const client = await getClient();

  const tokenTransferTx = new TransferTransaction()
    .addTokenTransferWithDecimals(
      tokenId!,
      AccountId.fromString("0.0.6189"),
      10_172_691,
      6
    )
    .addTokenTransferWithDecimals(
      tokenId!,
      client.operatorAccountId!,
      -10_172_691,
      6
    )
    .setTransactionMemo("Transfer 10.172691 * to 0.0.6189")
    .setMaxTransactionFee(new Hbar(1))
    .freezeWith(client);

  console.log(tokenTransferTx);
  console.log(tokenTransferTx.toBytes());

  await tokenTransferTx.execute(client);
}

async function handleAssociateToken(): Promise<void> {
  const tokenStore = useTokenStore();
  const tokenId = tokenStore.token;
  const client = await getClient();

  const associateTx = new TokenAssociateTransaction()
    .setTokenIds([tokenId!])
    .setAccountId(client.operatorAccountId!)
    .setMaxTransactionFee(new Hbar(1))
    .setTransactionMemo(`Associate Token ${tokenId!.toString()}`)
    .freezeWith(client);

  console.log(associateTx);
  console.log(associateTx.toBytes());

  await associateTx.execute(client);
}

async function handleDissociateToken(): Promise<void> {
  const tokenStore = useTokenStore();
  const tokenId = tokenStore.token;
  const client = await getClient();

  const dissociateTx = new TokenDissociateTransaction()
    .setTokenIds([tokenId!])
    .setAccountId(client.operatorAccountId!)
    .setMaxTransactionFee(new Hbar(1))
    .setTransactionMemo(`Dissociate ${tokenId!.toString()}`)
    .freezeWith(client);

  console.log(dissociateTx);
  console.log(dissociateTx.toBytes());

  await dissociateTx.execute(client);
}

async function handleMintToken(): Promise<void> {
  const tokenStore = useTokenStore();
  const tokenId = tokenStore.token;
  const client = await getClient();

  const mintTx = new TokenMintTransaction()
    .setAmount(10_555_666)
    .setMaxTransactionFee(new Hbar(2))
    .setTokenId(tokenId!)
    .setTransactionMemo(`Mint 10.555666 ${tokenId!.toString()}`)
    .freezeWith(client);

  console.log(mintTx);
  console.log(mintTx.toBytes());

  await mintTx.execute(client);
}

async function handleBurnToken(): Promise<void> {
  const tokenStore = useTokenStore();
  const tokenId = tokenStore.token;
  const client = await getClient();

  const burnTx = new TokenBurnTransaction()
    .setAmount(10_555_666)
    .setMaxTransactionFee(new Hbar(2))
    .setTokenId(tokenId!)
    .setTransactionMemo(`Burn 10.555666 ${tokenId!.toString()}`)
    .freezeWith(client);

  console.log(burnTx);
  console.log(burnTx.toBytes());

  await burnTx.execute(client);
}
</script>

<template>
  <div class="grid grid-cols-2">
    <Button label="Connect Wallet" @click="handleConnectWallet" />
    <Button label="Create Token" @click="handleCreateToken" />
    <Button label="Verify Account" @click="handleVerifyAccount" />
    <Button label="Create Account" @click="handleCreateAccount" />
    <Button label="Stake to Node 3" @click="handleStakeNode" />
    <Button label="Stake to Account 6189" @click="handleStakeAccount" />
    <Button label="Transfer Hbar" @click="handleTransferHbar" />
    <Button label="Transfer Token" @click="handleTransferToken" />
    <Button label="Associate Token" @click="handleAssociateToken" />
    <Button label="Dissociate Token" @click="handleDissociateToken" />
    <Button label="Mint Token" @click="handleMintToken" />
    <Button label="Burn Token" @click="handleBurnToken" />
  </div>
</template>
