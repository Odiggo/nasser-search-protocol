import '../styles/globals.css'
import 'antd/dist/antd.dark.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '@solana/wallet-adapter-react'
import { getWalletAdapters } from '@solana/wallet-adapter-wallets'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {
  EnvironmentProvider,
  getInitialProps,
} from 'providers/EnvironmentProvider'
import { UTCNowProvider } from 'providers/UTCNowProvider'

require('@solana/wallet-adapter-react-ui/styles.css')

const App = ({
  Component,
  pageProps,
  cluster,
}: AppProps & { cluster: string }) => (
  <UTCNowProvider>
    <EnvironmentProvider defaultCluster={cluster}>
      <WalletProvider wallets={getWalletAdapters()} autoConnect>
          <WalletModalProvider>
            <Component {...pageProps} />
          </WalletModalProvider>
      </WalletProvider>
    </EnvironmentProvider>
  </UTCNowProvider>
)

App.getInitialProps = getInitialProps

export default App
