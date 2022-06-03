import { useWallet } from '@solana/wallet-adapter-react'
// import { useRouter } from 'next/router'

export const useWalletId = () => {
  const wallet = useWallet()
  // const { query } = useRouter()
  return wallet.publicKey
}
