import { BN } from "@project-serum/anchor";
import type * as web3 from "@solana/web3.js";
import type { Wallet } from "@saberhq/solana-contrib";
import { findEscrowId, findResourceId, findSessionId } from "./pdas";
import { tryGetAccount } from "./utils";
import { startSession, endSession, initResource, initSession } from "./instructions";

export const withInitResource = async (
  transaction: web3.Transaction,
  connection: web3.Connection,
  wallet: Wallet,
  params: {
    uuid: string;
    chargeAmount?: BN;
    chargeDivisor?: BN;
  }
): Promise<[web3.Transaction, web3.PublicKey]> => {
  const [[resourceId], [escrowId]] = await Promise.all([
    await findResourceId(params.uuid),
    await findEscrowId(params.uuid)
  ]);

  transaction.add(
    initResource(connection, wallet, {
      uuid: params.uuid,
      resourceId: resourceId,
      escrowId:escrowId,
      authority: wallet.publicKey,
      chargeAmount: params.chargeAmount || new BN(1000000),
      chargeDivisor: params.chargeDivisor || new BN(1)
    })
  );
  return [transaction, resourceId];
};

export const withInitSession = async (
  transaction: web3.Transaction,
  connection: web3.Connection,
  wallet: Wallet,
  params: {
    resourceId: web3.PublicKey;
  }
): Promise<[web3.Transaction, web3.PublicKey]> => {
  const [sessionId] = await findSessionId(params.resourceId, wallet.publicKey);

  transaction.add(
    await initSession(connection, wallet, {
      resourceId: params.resourceId,
      sessionId: sessionId,
    })
  );
  return [transaction, sessionId];
};

export const withStartSession = async (
  transaction: web3.Transaction,
  connection: web3.Connection,
  wallet: Wallet,
  params: {
    resourceId: web3.PublicKey;
    escrowId: web3.PublicKey;
    sessionId: web3.PublicKey;
  }
): Promise<[web3.Transaction]> => {
  transaction.add(
    await startSession(connection, wallet, {
      resourceId: params.resourceId,
      escrowId: params.escrowId,
      sessionId: params.sessionId,
    })
  );
  return [transaction];
};

export const withEndSession = async (
  transaction: web3.Transaction,
  connection: web3.Connection,
  wallet: Wallet,
  params: {
    resourceId: web3.PublicKey;
    escrowId: web3.PublicKey;
    sessionId: web3.PublicKey;
  }
): Promise<[web3.Transaction]> => {
  transaction.add(
    await endSession(connection, wallet, {
      resourceId: params.resourceId,
      sessionId: params.sessionId,
      escrowId: params.escrowId,
    })
  );
  return [transaction];
};