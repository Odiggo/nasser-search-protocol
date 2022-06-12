import type { AnchorTypes } from "@saberhq/anchor-contrib";
import { PublicKey } from "@solana/web3.js";
import * as SEARCH_TYPES from "./idl/search_contracts";

export const SEARCH_PROGRAM_ADDRESS = new PublicKey(
  "2rYAfiituf3R1DmAXuUw2AAN1HkudAAzcnna2CCNpQ8e"
);
  
export type SEARCH_PROGRAM = SEARCH_TYPES.SearchContracts;

export const SEARCH_IDL = SEARCH_TYPES.IDL;

export type SearchTypes = AnchorTypes<SEARCH_PROGRAM>;

export const RESOURCE_SEED = "resource";
export const ESCROW_SEED = "escrow";
export const SESSION_SEED = "session";

type Accounts = SearchTypes["Accounts"];

export type ResourceData = Accounts["resource"];
export type SessionData = Accounts["session"];

export type AccountData<T> = {
  pubkey: PublicKey;
  parsed: T;
};

export type AccountFn<T> = () => Promise<AccountData<T>>;