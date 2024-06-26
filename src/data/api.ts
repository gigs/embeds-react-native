import { useCallback, useEffect, useMemo, useState } from 'react'

import { Porting } from '../../types/porting'
import { ServiceProviderList } from '../../types/serviceProvider'
import { Subscription } from '../../types/subscription'
import { useSessionContext } from '../core/ConnectSessionProvider'

const baseUrlWithProjects = `https://api.gigs.com/projects`

export type ApiErrorType =
  | 'malformed'
  | 'unauthenticated'
  | 'permissionDenied'
  | 'notFound'
  | 'conflict'
  | 'invalid'
  | 'tooManyRequests'
  | 'internal'
  | 'notImplemented'
  | 'networkError'

interface ApiErrorOptions {
  type: string
  code: ApiErrorType
  message: string
  hint: string
  documentation: string[]
}

export class ApiError extends Error {
  object: string
  type: string
  code: ApiErrorType
  hint: string
  documentation: string[]

  constructor({ type, code, message, hint, documentation }: ApiErrorOptions) {
    super(message)
    this.object = 'error'
    this.type = type
    this.code = code
    this.hint = hint
    this.documentation = documentation

    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export function useGetSubscription(subscription: string) {
  const { project, token } = useSessionContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ApiError | string | null>(null)
  const [data, setData] = useState<null | Subscription>(null)

  const getSubscription = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${baseUrlWithProjects}/${project}/subscriptions/${subscription}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status !== 200) {
        setError('Subscription not found.')
      } else {
        const subscriptionData = await response.json()
        setData(subscriptionData)
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e)
      } else {
        setError('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }, [token, project, subscription])

  useEffect(() => {
    getSubscription()
  }, [getSubscription])

  return useMemo(
    () => ({ error, loading, data, refetch: getSubscription }),
    [error, loading, data, getSubscription]
  )
}

export type UpdatePortingValues = {
  accountPin?: string
  accountNumber?: string
  firstName?: string
  lastName?: string
  birthday?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    country?: string
    postalCode?: string
    state?: string
  }
  donorProviderApproval?: boolean
  donorProvider?: string
}

export function useUpdatePorting() {
  const { project, token } = useSessionContext()

  return useCallback(
    async (portingId: string, values: UpdatePortingValues) => {
      const res = await fetch(
        `${baseUrlWithProjects}/${project}/portings/${portingId}`,
        {
          method: 'PATCH',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      )

      if (!res.ok) {
        const body = await res
          .json()
          .catch(async () => ({ message: await res.text() }))
          .catch((error) => error)
        throw new ApiError(body.error)
      }

      const body = (await res.json()) as Porting
      return body
    },
    [project, token]
  )
}

export const useGetServiceProviders = (recipientProvider: string) => {
  const { token } = useSessionContext()

  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<null | ServiceProviderList>(null)

  const getServiceProviders = useCallback(async () => {
    try {
      const res = await fetch(
        `https://api.gigs.com/serviceProviders?limit=200&recipientProvider=${recipientProvider}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      if (res.status === 404) {
        setError(new Error('Service Providers not found.'))
      }
      const serviceProviderData = (await res.json()) as ServiceProviderList
      setData(serviceProviderData)
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e)
      } else {
        setError(new Error('Something went wrong'))
      }
    }
  }, [token, recipientProvider])

  useEffect(() => {
    getServiceProviders()
  }, [getServiceProviders])

  return useMemo(() => ({ error, data }), [error, data])
}
