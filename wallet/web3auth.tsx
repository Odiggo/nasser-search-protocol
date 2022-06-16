import React from 'react';
import {
  ADAPTER_EVENTS,
  SafeEventEmitterProvider,
  CHAIN_NAMESPACES
} from '@web3auth/base';
import { Web3Auth } from '@web3auth/web3auth';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { SolanaWallet } from '@web3auth/solana-provider';
import { Connection, PublicKey } from '@solana/web3.js';

interface IWeb3AuthContext {
  connection: Connection;
  wallet: SolanaWallet | undefined;
  publicKey: PublicKey | null;
  login: () => void;
  logout: () => void;
}

export const Web3AuthContext = React.createContext({} as IWeb3AuthContext);

interface IWeb3AuthProvider {
  clientId: string;
  endpoint: string;
  children: React.ReactNode;
}

export const Web3AuthProvider = ({
  clientId,
  endpoint,
  children
}: IWeb3AuthProvider) => {
  const [connection] = React.useState(new Connection(endpoint));
  const [web3Auth, setWeb3Auth] = React.useState<Web3Auth>();
  const [wallet, setWallet] = React.useState<SolanaWallet>();
  const [publicKey, setPublicKey] = React.useState<PublicKey | null>(null);

  // Update public keys on wallet change.
  React.useEffect(() => {
    (async () => {
      if (!wallet) {
        setPublicKey(null);
        return;
      }
      try {
        const publicKeys = await wallet.requestAccounts();
        setPublicKey(new PublicKey(publicKeys[0]!));
      } catch {
        console.error('web3auth failed to request accounts from provider.');
      }
    })();
  }, [wallet]);

  React.useEffect(() => {
    // Initialize web3auth instance.
    import('@web3auth/web3auth').then(async pack => {
      try {
        const web3AuthInstance = new pack.Web3Auth({
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.SOLANA,
            rpcTarget: endpoint,
            blockExplorer: 'https://explorer.solana.com/',
            chainId: '0x1',
            displayName: 'Solana Mainnet',
            ticker: 'SOL',
            tickerName: 'Solana'
          },
          clientId,
          uiConfig: { theme: 'dark', appLogo: '/Odiggo.png' }
        });
        web3AuthInstance.configureAdapter(
          new OpenloginAdapter({
            adapterSettings: { network: 'mainnet', clientId }
          })
        );
        // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS.
        web3AuthInstance.on(ADAPTER_EVENTS.CONNECTED, data => {
          console.log(`web3auth ${ADAPTER_EVENTS.CONNECTED}`, data);
          setWallet(
            new SolanaWallet(
              web3AuthInstance.provider as SafeEventEmitterProvider
            )
          );
        });
        web3AuthInstance.on(ADAPTER_EVENTS.DISCONNECTED, () => {
          console.log(`web3auth ${ADAPTER_EVENTS.DISCONNECTED}`);
          setWallet(undefined);
        });
        web3AuthInstance.on(ADAPTER_EVENTS.CONNECTING, () => {
          console.log(`web3auth ${ADAPTER_EVENTS.CONNECTING}`);
        });
        web3AuthInstance.on(ADAPTER_EVENTS.ERRORED, error => {
          console.error(`web3auth ${ADAPTER_EVENTS.ERRORED}`, error);
        });
        setWeb3Auth(web3AuthInstance);
        await web3AuthInstance.initModal();
      } catch (error) {
        console.error(error);
      }
    });
  }, [clientId, endpoint]);

  const login = React.useCallback(async () => {
    if (!web3Auth) {
      console.log('web3auth not yet initialized.');
      return;
    }

    try {
      const localProvider = await web3Auth.connect();
      if (!localProvider) throw new Error('web3auth connect failure.');
      setWallet(new SolanaWallet(localProvider));
    } catch {
      console.error('web3auth login failure.');
    }
  }, [web3Auth]);

  const logout = React.useCallback(async () => {
    if (!web3Auth) {
      console.log('web3auth not yet initialized.');
      return;
    }

    try {
      await web3Auth.logout();
      setWallet(undefined);
    } catch {
      console.error('web3auth logout failure.');
    }
  }, [web3Auth]);

  // Compose memoized provider value.
  const value = React.useMemo(
    () => ({
      connection,
      wallet,
      publicKey,
      login,
      logout
    }),
    [connection, wallet, publicKey, login, logout]
  );

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  );
};
