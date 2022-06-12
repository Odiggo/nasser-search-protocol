import type { BN } from "@project-serum/anchor";
import type { Wallet } from "@saberhq/solana-contrib";
import type { Connection } from "@solana/web3.js";
import { PublicKey, Transaction } from "@solana/web3.js";
import { getResourceData, getSessionData } from "./accounts";
import { findEscrowId, findResourceId, findSessionId } from "./pdas";
import { withEndSession, withInitResource, withInitSession, withStartSession } from "./transactions";
import { tryGetAccount } from "./utils";

export const startReading = async (
    connection: Connection,
    wallet: Wallet,
    params: {
        uuid: string
    }
): Promise<[Transaction, PublicKey, PublicKey]> => {
    let transaction = new Transaction();

    const [[resourceId], [escrowId]] = await Promise.all([
        await findResourceId(params.uuid),
        await findEscrowId(params.uuid)
    ]);
    const resourceData = await tryGetAccount(() =>
        getResourceData(connection, resourceId)
    );

    if (!resourceData) {
        [transaction] = await withInitResource(transaction, connection, wallet, {
            uuid: params.uuid
        });
    } 

    const [sessionId] = await findSessionId(
        resourceId,
        wallet.publicKey
    );
    const sessionData = await tryGetAccount(() =>
        getSessionData(connection, sessionId)
    );
    if (!sessionData) {
        [transaction] = await withInitSession(transaction, connection, wallet, {
            resourceId: resourceId
        });
    }

    await withStartSession(transaction, connection, wallet, {
        resourceId,
        escrowId,
        sessionId
    });

    return [transaction, resourceId, sessionId];
}

export const stopReading = async (
    connection: Connection,
    wallet: Wallet,
    params: {
        uuid: string
    }
): Promise<[Transaction, PublicKey, PublicKey]> => {
    let transaction = new Transaction();

    const [[resourceId], [escrowId]] = await Promise.all([
        await findResourceId(params.uuid),
        await findEscrowId(params.uuid)
    ]);
    const resourceData = await tryGetAccount(() =>
        getResourceData(connection, resourceId)
    );
    if (!resourceData) {
        throw new Error("Resource doesn't exist");
    } 

    const [sessionId] = await findSessionId(
        resourceId,
        wallet.publicKey
    );
    const sessionData = await tryGetAccount(() =>
        getSessionData(connection, sessionId)
    );
    if (!sessionData) {
        throw new Error("Session doesn't exist");
    }

    await withEndSession(transaction, connection, wallet, {
        resourceId,
        escrowId,
        sessionId,
    });

    return [transaction, resourceId, sessionId];
}