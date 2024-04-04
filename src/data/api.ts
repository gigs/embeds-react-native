import { useCallback, useEffect, useMemo, useState } from 'react'

import { Porting } from '../../types/porting'
import { Subscription } from '../../types/subscription'
import { useSessionContext } from '../core/ConnectSessionProvider'

const baseUrl = `https://api.gigs.com/projects`

export class ApiError extends Error {}

export function useGetSubscription(subscription: string) {
  const { project, token } = useSessionContext()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<null | Subscription>(null)

  const getSubscription = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${baseUrl}/${project}/subscriptions/${subscription}`,
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
        setError(e.message)
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
}

export function useUpdatePorting() {
  const { project, token } = useSessionContext()

  return useCallback(
    async (portingId: string, values: UpdatePortingValues) => {
      const res = await fetch(`${baseUrl}/${project}/portings/${portingId}`, {
        method: 'PATCH',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const body = await res
          .json()
          .catch(async () => ({ message: await res.text() }))
          .catch((error) => ({ message: error.message }))
        throw new ApiError('Failed: ' + body.message)
      }

      const body = (await res.json()) as Porting
      return body
    },
    [project, token]
  )
}
