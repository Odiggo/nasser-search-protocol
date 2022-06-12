import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, BorshAccountsCoder, Program } from "@project-serum/anchor";
import { AccountData, ResourceData, SEARCH_IDL, SEARCH_PROGRAM, SEARCH_PROGRAM_ADDRESS, SessionData } from "./constants";

export const getResourceData = async (
  connection: Connection,
  resourceId: PublicKey
): Promise<AccountData<ResourceData>> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const provider = new AnchorProvider(connection, null, {});
  const searchProgram = new Program<SEARCH_PROGRAM>(
    SEARCH_IDL,
    SEARCH_PROGRAM_ADDRESS,
    provider
  );

  const parsed = await searchProgram.account.resource.fetch(resourceId);
  return {
    parsed,
    pubkey: resourceId,
  };
};

export const getSessionData = async (
  connection: Connection,
  sessionId: PublicKey
): Promise<AccountData<SessionData>> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const provider = new AnchorProvider(connection, null, {});
  const searchProgram = new Program<SEARCH_PROGRAM>(
    SEARCH_IDL,
    SEARCH_PROGRAM_ADDRESS,
    provider
  );

  const parsed = await searchProgram.account.session.fetch(sessionId);
  return {
    parsed,
    pubkey: sessionId,
  };
};