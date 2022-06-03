import { Connection } from '@solana/web3.js'
import { firstParam } from 'common/utils'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import React, { useContext, useMemo, useState } from 'react'

export interface Environment {
  label: string
  value: string
  override?: string
}

export interface EnvironmentContextValues {
  environment: Environment
  setEnvironment: (newEnvironment: Environment) => void
  connection: Connection
}

export const ENVIRONMENTS: Environment[] = [
  {
    label: 'mainnet',
    value:
      'https://solana-api.syndica.io/access-token/ACRIJz9s2EE1jioRbWJAGv7F55QJKY10Or8gYwzw4DzoliDLxqnoj9cq0aGi5AhR/rpc',
    override: 'https://ssc-dao.genesysgo.net',
  },
  {
    label: 'testnet',
    value: 'https://api.testnet.solana.com',
  },
  {
    label: 'devnet',
    value: 'https://api.devnet.solana.com',
  },
  {
    label: 'localnet',
    value: 'http://127.0.0.1:8899',
  },
]

const EnvironmentContext: React.Context<null | EnvironmentContextValues> =
  React.createContext<null | EnvironmentContextValues>(null)

export const getInitialProps = async ({
  ctx,
}: {
  ctx: NextPageContext
}): Promise<{ cluster: string }> => {
  // const cluster = (ctx.req?.headers.host || ctx.query.host)?.includes('dev')
  //   ? 'devnet'
  //   : (ctx.query.project || ctx.query.host)?.includes('test')
  //   ? 'testnet'
  //   : ctx.query.cluster || process.env.BASE_CLUSTER
  const cluster = 'devnet';
  return {
    cluster: firstParam(cluster),
  }
}

export function EnvironmentProvider({
  children,
  defaultCluster,
}: {
  children: React.ReactChild
  defaultCluster: string
}) {
  const { query } = useRouter()
  // const cluster = (query.project || query.host)?.includes('dev')
  //   ? 'devnet'
  //   : query.host?.includes('test')
  //   ? 'testnet'
  //   : query.cluster || defaultCluster || process.env.BASE_CLUSTER
  const cluster = 'devnet';
  const foundEnvironment = ENVIRONMENTS.find((e) => e.label === cluster)
  const [environment, setEnvironment] = useState<Environment>(
    foundEnvironment ?? ENVIRONMENTS[0]!
  )

  useMemo(() => {
    const foundEnvironment = ENVIRONMENTS.find((e) => e.label === cluster)
    setEnvironment(foundEnvironment ?? ENVIRONMENTS[0]!)
  }, [cluster])

  const connection = useMemo(
    () => new Connection(environment.value, { commitment: 'recent' }),
    [environment]
  )

  return (
    <EnvironmentContext.Provider
      value={{
        environment,
        setEnvironment,
        connection,
      }}
    >
      {children}
    </EnvironmentContext.Provider>
  )
}

export function useEnvironmentCtx(): EnvironmentContextValues {
  const context = useContext(EnvironmentContext)
  if (!context) {
    throw new Error('Missing connection context')
  }
  return context
}
