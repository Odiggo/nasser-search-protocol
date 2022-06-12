import * as anchor from "@project-serum/anchor";
import { startReading, stopReading } from "../src/apis";
import { Transaction } from "@solana/web3.js";
import chai, { assert, expect } from "chai";
import { chaiSolana, expectTXTable } from "@saberhq/chai-solana";
import {
  SignerWallet,
  SolanaProvider,
  TransactionEnvelope,
} from "@saberhq/solana-contrib";
import { getSessionData } from "../src/accounts";

chai.use(chaiSolana);

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("search-contracts", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const uuid = "aad-dffdf";

  it("starts reading", async () => {
    const [transaction, resourceId, sessionId] = await startReading(
      provider.connection,
      provider.wallet,
      {
        uuid: uuid
      }
    );

    await expectTXTable(
      new TransactionEnvelope(SolanaProvider.init(provider), [
        ...transaction.instructions,
      ]),
      "Start Reading", {
        verbosity: 'always'
      }
    ).to.be.fulfilled;

    const sessionData = await getSessionData(provider.connection, sessionId);
    expect(sessionData.parsed.isActive).to.eq(true);
  });

  it("stops reading", async () => {
    await delay(2000);

    const [transaction, resourceId, sessionId] = await stopReading(
      provider.connection,
      provider.wallet,
      {
        uuid: uuid
      }
    );

    await expectTXTable(
      new TransactionEnvelope(SolanaProvider.init(provider), [
        ...transaction.instructions,
      ]),
      "Stop Reading", {
        verbosity: 'always'
      }
    ).to.be.fulfilled;

    const sessionData = await getSessionData(provider.connection, sessionId);
    expect(sessionData.parsed.isActive).to.eq(false);
  });
});
