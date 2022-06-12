import { AccountFn } from "./constants";

export async function tryGetAccount<T>(fn: AccountFn<T>) {
    try {
      return await fn();
    } catch {
      return null;
    }
  }