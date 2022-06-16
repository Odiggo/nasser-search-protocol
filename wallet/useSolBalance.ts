import React from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface IWallet {
  type: 'solana' | 'web3auth' | undefined;
  connection: Connection;
  publicKey: PublicKey | null;
}

export const useSolBalance = (wallet?: IWallet): number => {
  const [balance, setBalance] = React.useState(0);

  React.useEffect(() => {
    (async () => {
      if (!wallet || !wallet.connection || !wallet.publicKey) {
        setBalance(0);
        return;
      }

      try {
        const solBalance = await wallet.connection.getBalance(wallet.publicKey);
        setBalance(solBalance / LAMPORTS_PER_SOL);
      } catch {
        console.error('web3auth failed to get sol balance.');
        setBalance(0);
      }
    })();
  }, [wallet]);

  return balance;
};
