import React from 'react';
import { darken } from 'polished'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  useWalletModal,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import * as web3 from '@solana/web3.js'
import { useRouter } from 'next/router'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'
import { shortPubKey } from './utils'
import { HiUserCircle } from 'react-icons/hi'
import { WalletContext } from 'wallet'
import { notify } from './Notification';

export const Header = () => {
  const router = useRouter()
  const ctx = useEnvironmentCtx()
  // const wallet = useWallet()
  // const { setVisible } = useWalletModal()

  const { login, logout, publicKey } = React.useContext(WalletContext);
  
  const airdropSol = async () => {
    var airdropSignature = await ctx.connection.requestAirdrop(
     publicKey!,
      2 * web3.LAMPORTS_PER_SOL,
    );

    // Confirming that the airdrop went through
    await ctx.connection.confirmTransaction(airdropSignature);
    notify({
      message: `Successfully airdropped 2 SOL`,
      type: 'success',
  })
  }

  return (
    <div className={`flex h-20 justify-between px-5`}>
      <div className="flex items-center gap-3">
        {ctx.environment.label !== 'mainnet' && (
          <div className="cursor-pointer rounded-md bg-[#9945ff] p-1 text-[10px] italic text-white">
            {ctx.environment.label}
          </div>
        )}
      </div>
      <div className="relative my-auto flex items-center align-middle">
      {publicKey ? (
        <div>
          <button 
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            zIndex: 10,
            height: '38px',
            // border: 'none',
            background: 'blue',
            backgroundColor: 'none',
          }}
         onClick={airdropSol}>Aidrop 2 SOL</button>
        <button 
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px',
            zIndex: 10,
            height: '38px',
            // border: 'none',
            background: 'blue',
            backgroundColor: 'none',
          }}
         onClick={logout}>Disconnect</button>
        </div>
      ) : (
        <div>
          <button
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              zIndex: 10,
              height: '38px',
              // border: 'none',
              background: 'blue',
              backgroundColor: 'none',
            }}
            onClick={() => login('web3auth')}
          >
            Connect with Email
          </button>
          <button
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              zIndex: 10,
              height: '38px',
              // border: 'none',
              background: 'blue',
              backgroundColor: 'none',
            }}
            // className="btn btn-primary min-w-[190px]"
            onClick={() => login('solana')}
          >
            Connect Wallet
          </button>
        </div>
      )}
        {/* {wallet.connected ? (
          <div
            className="flex cursor-pointer gap-2"
            onClick={() => setVisible(true)}
          >
            <div>
              <div style={{ color: 'gray' }}>
                {wallet?.publicKey ? shortPubKey(wallet?.publicKey) : ''}
              </div>
            </div>
          </div>
        ) : (
          <WalletMultiButton
            style={{
              // color: 'rgba(255,255,255,0.8)',
              fontSize: '14px',
              zIndex: 10,
              height: '38px',
              border: 'none',
              background: 'none',
              backgroundColor: 'none',
            }}
          />
        )} */}
      </div>
    </div>
  )
}
