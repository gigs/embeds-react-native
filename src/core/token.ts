import {
  ConnectSession,
  ConnectSessionIntent,
} from '../../types/connectSession'
import { assert } from './assert'

type Tokens = {
  access_token: string
}

type Options = {
  signal: AbortSignal
  intentType: ConnectSessionIntent['type']
}

export async function exchangeSessionWithToken(
  unverifiedConnectSession: unknown,
  { signal, intentType }: Options
) {
  assert(
    unverifiedConnectSession,
    'Embed tried to exchange a token without a ConnectSession.'
  )
  assert(
    typeof unverifiedConnectSession === 'object' &&
      'object' in unverifiedConnectSession &&
      'intent' in unverifiedConnectSession &&
      unverifiedConnectSession.object === 'connectSession',
    'Embed was not initialized with a Connect Session resource'
  )
  const connectSession = unverifiedConnectSession as ConnectSession
  assert(
    connectSession.intent.type === intentType,
    `Embed must be initialized with an intent of type "${intentType}", but got "${connectSession.intent.type} instead.`
  )
  assert(
    connectSession.url,
    'The ConnectSession has no URL. The created resource must be passed into the embed.'
  )
  const url = new URL(connectSession.url)
  const csnToken = url.searchParams.get('token')
  assert(
    csnToken,
    'The URL in the ConnectSession has no token. You must pass in an authenticated ConnectSession.'
  )

  const res = await fetch('https://connect.gigs.com/api/embeds/auth', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ secret: csnToken }),
    signal,
  })

  const body: { token?: Tokens; error?: string } = await res
    .json()
    .catch(async () => ({ error: await res.text() }))
    .catch((error) => ({ error: error.toString() }))

  if (signal.aborted) {
    return { result: 'aborted' } as const
  }

  assert(res.status !== 422, 'The ConnectSession has expired.')
  assert(res.ok, `Fetch failed to initialize embed. ${body.error}`)
  assert(
    body.token?.access_token,
    'Fatal error while initizing the embed: Expected an access token, but got none.'
  )
  const token = body.token.access_token

  return { result: 'ok', connectSession, token } as const
}
