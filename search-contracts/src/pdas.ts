import { utils } from "@project-serum/anchor";
import * as web3 from "@solana/web3.js";
import { ESCROW_SEED, RESOURCE_SEED, SEARCH_PROGRAM_ADDRESS, SESSION_SEED } from "./constants";

export const findResourceId = async (
  uuid: string
): Promise<[web3.PublicKey, number]> => {
  return web3.PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode(RESOURCE_SEED),
      utils.bytes.utf8.encode(uuid),
    ],
    SEARCH_PROGRAM_ADDRESS
  );
};

export const findEscrowId = async (
  uuid: string
): Promise<[web3.PublicKey, number]> => {
  return web3.PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode(ESCROW_SEED),
      utils.bytes.utf8.encode(uuid),
    ],
    SEARCH_PROGRAM_ADDRESS
  );
};

export const findSessionId = async (
  resourceId: web3.PublicKey,
  userId: web3.PublicKey,
): Promise<[web3.PublicKey, number]> => {
  return web3.PublicKey.findProgramAddress(
    [
      utils.bytes.utf8.encode(SESSION_SEED),
      resourceId.toBuffer(),
      userId.toBuffer(),
    ],
    SEARCH_PROGRAM_ADDRESS
  );
};