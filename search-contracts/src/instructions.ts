import type { BN } from "@project-serum/anchor";
import type {
  Connection,
  PublicKey,
  TransactionInstruction,
} from "@solana/web3.js";
import { SystemProgram } from "@solana/web3.js";
import type { Wallet } from "@saberhq/solana-contrib";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { SEARCH_PROGRAM_ADDRESS, SEARCH_IDL, SEARCH_PROGRAM } from "./constants";
import {
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export const initResource = (
  connection: Connection,
  wallet: Wallet,
  params: {
    uuid: string;
    resourceId: PublicKey;
    escrowId: PublicKey;
    authority: PublicKey;
    chargeAmount: BN;
    chargeDivisor: BN;
  }
  ): TransactionInstruction => {
  const provider = new AnchorProvider(connection, wallet, {});
  const searchProgram = new Program<SEARCH_PROGRAM>(
    SEARCH_IDL,
    SEARCH_PROGRAM_ADDRESS,
    provider
  );
  return searchProgram.instruction.initResource(
    {
      uuid: params.uuid,
      chargeAmount: params.chargeAmount,
      chargeDivisor: params.chargeDivisor
    }, 
    {
    accounts: {
      resource: params.resourceId,
      escrow: params.escrowId,
      authority: params.authority,
      payer: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }
  })
};

export const initSession = (
  connection: Connection,
  wallet: Wallet,
  params: {
    resourceId: PublicKey;
    sessionId: PublicKey;
  }
  ): TransactionInstruction => {
  const provider = new AnchorProvider(connection, wallet, {});
  const searchProgram = new Program<SEARCH_PROGRAM>(
    SEARCH_IDL,
    SEARCH_PROGRAM_ADDRESS,
    provider
  );
  return searchProgram.instruction.initSession(
  {
    accounts: {
      session: params.sessionId,
      resource: params.resourceId,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }
  })
};

export const startSession = (
  connection: Connection,
  wallet: Wallet,
  params: {
    resourceId: PublicKey;
    escrowId: PublicKey;
    sessionId: PublicKey;
  }
  ): TransactionInstruction => {
  const provider = new AnchorProvider(connection, wallet, {});
  const searchProgram = new Program<SEARCH_PROGRAM>(
    SEARCH_IDL,
    SEARCH_PROGRAM_ADDRESS,
    provider
  );
  return searchProgram.instruction.startSession(
  {
    accounts: {
      session: params.sessionId,
      resource: params.resourceId,
      escrow: params.escrowId,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }
  })
};


export const endSession = (
  connection: Connection,
  wallet: Wallet,
  params: {
    resourceId: PublicKey;
    escrowId: PublicKey;
    sessionId: PublicKey;
  }
  ): TransactionInstruction => {
  const provider = new AnchorProvider(connection, wallet, {});
  const searchProgram = new Program<SEARCH_PROGRAM>(
    SEARCH_IDL,
    SEARCH_PROGRAM_ADDRESS,
    provider
  );
  return searchProgram.instruction.endSession(
  {
    accounts: {
      session: params.sessionId,
      resource: params.resourceId,
      escrow: params.escrowId,
      user: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    }
  })
};
