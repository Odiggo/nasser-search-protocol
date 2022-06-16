import React from 'react';
import { Web3AuthProvider } from './web3auth';
import { SolanaProvider } from './solana';
import {
  UnifiedWalletProvider,
  WalletContext,
  IAddress
} from './unified-wallet';
import {
  ADDRESS_CONFIG,
  WEB3AUTH_CLIENTID,
  SOLANA_RPC_ENDPOINT,
} from '../configs';

export { WalletContext };


const defaultAddress = {
  usdtMint: ADDRESS_CONFIG.USDT_MINT,
  usdcMint: ADDRESS_CONFIG.USDC_MINT
};

interface IWalletProvider {
  web3authClientId?: string;
  endpoint?: string;
  address?: IAddress;
  children: React.ReactNode | React.ReactNode[];
}

export const WalletProvider = ({
  web3authClientId = WEB3AUTH_CLIENTID,
  endpoint = SOLANA_RPC_ENDPOINT,
  address = defaultAddress,
  children
}: IWalletProvider) => (
    <Web3AuthProvider clientId={web3authClientId} endpoint={endpoint}>
      <SolanaProvider endpoint={endpoint}>
        <UnifiedWalletProvider address={address}>
          {children}
        </UnifiedWalletProvider>
      </SolanaProvider>
    </Web3AuthProvider>
);
