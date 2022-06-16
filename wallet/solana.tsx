import React from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

const network = WalletAdapterNetwork.Mainnet;

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new SolletWalletAdapter({ network }),
  new SolletExtensionWalletAdapter({ network })
];

interface ISolanaProvider {
  endpoint: string;
  children: React.ReactNode;
}

export const SolanaProvider = ({ endpoint, children }: ISolanaProvider) => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider
      wallets={wallets}
      autoConnect
      onError={() => {
        console.error('Solana provider error connecting to wallet.');
      }}
    >
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);
