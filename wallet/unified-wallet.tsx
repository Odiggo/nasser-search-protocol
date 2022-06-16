import React from 'react';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

import { Web3AuthContext } from './web3auth';
import { useSolBalance } from './useSolBalance';

type TWalletProvider = 'solana' | 'web3auth';

export interface IWallet {
  type: TWalletProvider | undefined;
  connection: Connection;
  publicKey: PublicKey | null;
}

interface IWalletContext extends IWallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  login: (provider: TWalletProvider) => void;
  logout: () => void;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
  solBalance: number;
}

export const WalletContext = React.createContext<IWalletContext>(
  {} as IWalletContext
);

export interface IAddress {
  usdtMint: string;
  usdcMint: string;
}

interface IWalletProvider {
  address: IAddress;
  children: React.ReactNode | React.ReactNode[];
}

export const UnifiedWalletProvider = ({
  address,
  children
}: IWalletProvider) => {
  // Common wallet
  const [wallet, setWallet] = React.useState<IWallet>();
  const solBalance = useSolBalance(wallet);

  // Provider 1: Solana wallet provider.
  const { connection: solanaConnection } = useConnection();
  const {
    publicKey: solanaPublicKey,
    disconnect: solanaLogout,
    sendTransaction: solanaSendTransaction,
    signTransaction: solanaSignTransaction,
    signAllTransactions: solanaSignAllTransactions,
    signMessage: solanaSignMessage
  } = useWallet();
  const { setVisible: solanaModal } = useWalletModal();

  // Provider 2: Web3Auth wallet provider.
  const {
    connection: w3aConnection,
    wallet: w3aWallet,
    publicKey: w3aPublicKey,
    login: w3aLogin,
    logout: w3aLogout
  } = React.useContext(Web3AuthContext);

  // Compose a new wallet.
  React.useEffect(() => {
    // Have preference for solana wallet.
    if (solanaPublicKey) {
      setWallet({
        type: 'solana',
        connection: solanaConnection,
        publicKey: solanaPublicKey
      });
    } else if (w3aPublicKey) {
      setWallet({
        type: 'web3auth',
        connection: w3aConnection,
        publicKey: w3aPublicKey
      });
    } else {
      setWallet({
        type: undefined,
        connection: solanaConnection,
        publicKey: null
      });
    }
  }, [solanaPublicKey, solanaConnection, w3aPublicKey, w3aConnection]);

  const login = React.useCallback(
    (provider: TWalletProvider) => {
      // Flow for Solana.
      if (provider === 'solana') {
        solanaModal(true);
        return;
      }

      // Flow for Web3Auth.
      w3aLogin();
    },
    [solanaModal, w3aLogin]
  );

  const logout = React.useCallback(() => {
    if (!wallet?.type) return;

    // Flow for Solana.
    if (wallet.type === 'solana') {
      solanaLogout();
      return;
    }

    // Flow for Web3Auth.
    w3aLogout();
  }, [w3aLogout, solanaLogout, wallet]);

  const signMessage = React.useCallback(
    async (message: Uint8Array): Promise<Uint8Array> => {
      if (!wallet?.type) throw new Error('Wallet not connected.');

      // Flow for Solana.
      if (wallet.type === 'solana') {
        if (!solanaSignMessage) throw new Error('Solana not connected.');
        return solanaSignMessage(message);
      }

      // Flow for Web3Auth.
      if (!w3aWallet) throw new Error('Web3Auth not connected.');
      return w3aWallet.signMessage(message);
    },
    [wallet, solanaSignMessage, w3aWallet]
  );

  const sendTransaction = React.useCallback(
    async (transaction: Transaction): Promise<string> => {
      if (!wallet?.type) throw new Error('Wallet not connected.');

      // Flow for Solana.
      if (wallet.type === 'solana') {
        const solanaTxResponse = await solanaSendTransaction(
          transaction,
          solanaConnection
        );
        return solanaTxResponse;
      }

      // Flow for Web3Auth.
      if (!w3aWallet) throw new Error('Web3Auth not connected.');
      const w3aTxResponse = await w3aWallet.signAndSendTransaction(transaction);
      return w3aTxResponse.signature;
    },
    [wallet, w3aWallet, solanaSendTransaction, solanaConnection]
  );

  const signTransaction = React.useCallback(
    async (transaction: Transaction): Promise<Transaction> => {
      if (!wallet?.type) throw new Error('Wallet not connected.');

      // Flow for Solana.
      if (wallet.type === 'solana') {
        const solanaTxResponse = await solanaSignTransaction!(
          transaction
        );
        return solanaTxResponse;
      }

      // Flow for Web3Auth.
      if (!w3aWallet) throw new Error('Web3Auth not connected.');
      const w3aTxResponse = await w3aWallet.signTransaction(transaction);
      return w3aTxResponse;
    },
    [wallet, w3aWallet, solanaSendTransaction, solanaConnection]
  );

  const signAllTransactions = React.useCallback(
    async (transactions: Transaction[]): Promise<Transaction[]> => {
      if (!wallet?.type) throw new Error('Wallet not connected.');

      // Flow for Solana.
      if (wallet.type === 'solana') {
        const solanaTxResponse = await solanaSignAllTransactions!(
          transactions
        );
        return solanaTxResponse;
      }

      // Flow for Web3Auth.
      if (!w3aWallet) throw new Error('Web3Auth not connected.');
      const w3aTxResponse = await w3aWallet.signAllTransactions(transactions);
      return w3aTxResponse;
    },
    [wallet, w3aWallet, solanaSendTransaction, solanaConnection]
  );

  // Compose memoized provider value.
  const value = React.useMemo(
    () => ({
      // These conditional wallet properties won't matter since
      // we'll actually wait for wallet to be available before
      // first rendering.
      type: wallet ? wallet.type : undefined,
      connection: wallet ? wallet.connection : solanaConnection,
      publicKey: wallet ? wallet.publicKey : null,
      signTransaction,
      signAllTransactions,
      login,
      logout,
      sendTransaction,
      signMessage,
      solBalance,
    }),
    [
      wallet,

      signTransaction,
      signAllTransactions,
      login,
      logout,
      sendTransaction,
      signMessage,
      solBalance,
      solanaConnection
    ]
  );

  // Wait until wallet is initialized.
  if (!wallet) return null;

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
