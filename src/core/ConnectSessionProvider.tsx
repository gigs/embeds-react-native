import { createContext, useContext, useEffect, useState } from 'react'

import {
  ConnectSession,
  ConnectSessionIntent,
} from '../../types/connectSession'
import { assert } from './assert'
import { exchangeSessionWithToken } from './token'

type Context = {
  connectSession: ConnectSession
  token: string
  project: string
}

export const ConnectSessionContext = createContext<Context | null>(null)

type Status = 'idle' | 'loading' | 'loaded' | 'error'

type Props = {
  project: string
  supportedIntentType: ConnectSessionIntent['type']
  connectSession: unknown
  children: React.ReactNode
  onInitialized?: () => unknown
  onError?: (error: Error) => unknown
}

export function ConnectSessionProvider({
  project,
  supportedIntentType,
  connectSession: unverifiedConnectSession,
  children,
  onError,
  onInitialized,
}: Props) {
  const [connectSession, setConnectSession] = useState<ConnectSession>()

  const [userToken, setUserToken] = useState<string>()
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (!unverifiedConnectSession) {
      setConnectSession(undefined)
    }

    // Only initialize if there's a ConnectSession
    const isConnectSession =
      typeof unverifiedConnectSession === 'object' &&
      unverifiedConnectSession &&
      'id' in unverifiedConnectSession
    if (!isConnectSession) {
      return
    }

    // Only re-execute when the ConnectSession changed
    if (connectSession && connectSession.id === unverifiedConnectSession.id) {
      return
    }

    setStatus('idle')
    setConnectSession(undefined)
    setUserToken(undefined)

    const abortController = new AbortController()
    const signal = abortController.signal

    async function initialize() {
      setStatus('loading')

      try {
        const {
          result,
          connectSession: csn,
          token,
        } = await exchangeSessionWithToken(unverifiedConnectSession, {
          signal,
          intentType: supportedIntentType,
        })

        if (result === 'ok') {
          setConnectSession(csn)
          setUserToken(token)
          onInitialized?.()
          setStatus('loaded')
        }
      } catch (error) {
        setStatus('error')
        console.error(error)
        onError?.(
          error instanceof Error
            ? error
            : new Error(error?.toString() || 'Unexpected error')
        )
      }
    }

    initialize()

    return () => {
      abortController.abort()
    }
  }, [
    unverifiedConnectSession,
    connectSession,
    onError,
    onInitialized,
    supportedIntentType,
  ])

  if (status !== 'loaded') {
    return null
  }

  if (!connectSession || !userToken) {
    console.error('Embed is loaded but ConnectSession or Token are not there.')
    return null
  }

  return (
    <ConnectSessionContext.Provider
      value={{ connectSession, project, token: userToken }}
    >
      {children}
    </ConnectSessionContext.Provider>
  )
}

export function useSessionContext() {
  const ctx = useContext(ConnectSessionContext)
  assert(ctx, 'Read ConnectSessionContext, but Context is empty.')
  return ctx
}
