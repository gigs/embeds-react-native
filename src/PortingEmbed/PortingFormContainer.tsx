import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'

import { Porting } from '../../types/porting'
import { assert } from '../core/assert'
import { useSessionContext } from '../core/ConnectSessionProvider'
import {
  ApiError,
  UpdatePortingValues,
  useGetSubscription,
  useUpdatePorting,
} from '../data/api'
import { AccountHolderForm } from './features/AccountHolder/AccountHolderForm'
import { AddressForm } from './features/Address/AddressForm'
import { CarrierInfoForm } from './features/CarrierDetails/CarrierDetailsForm'
import { DonorApprovalForm } from './features/DonorApproval/DonorApprovalForm'
import { GenericPortingDeclined } from './features/GenericPortingDeclined'
import { ProtectionDisabling } from './features/ProtectionDisabling'
import { nextPortingStep, PortingStep } from './nextPortingStep'
import { hasAllRequiredFieldsCompleted } from './util/portingUtils'

type Props = {
  onError?: (error: Error) => unknown
  onLoaded?: () => unknown
  onCompleted: (porting: Porting) => unknown
  onSupportRequested?: () => unknown
  onPortingStep?: (portingStep: PortingStep) => unknown
}

export function PortingFormContainer({
  onError,
  onLoaded,
  onCompleted,
  onSupportRequested,
  onPortingStep,
}: Props) {
  const { connectSession } = useSessionContext()
  const {
    data: subscription,
    error,
    refetch,
  } = useGetSubscription(connectSession.intent.completePorting.subscription)
  const updatePorting = useUpdatePorting()
  const [isSubmitting, setSubmitting] = useState(false)
  const [portingUpdateError, setPortingUpdateError] = useState<
    string | undefined
  >(undefined)

  // TODO: move onError as a side effect into fetching, so it can't trigger
  // multiple times
  useEffect(() => {
    if (!error) return

    onError?.(new Error(error))
    console.error(error)
  }, [error, onError])

  // TODO: move onLoaded into the initial data fetching instead of an effect, so
  // it can't trigger multiple times, and will only be triggered for the initial
  // data loading
  const onLoadedTriggered = useRef(false)
  useEffect(() => {
    if (onLoadedTriggered.current) return
    if (!subscription) return

    onLoadedTriggered.current = true

    onLoaded?.()
  }, [subscription, onLoaded])

  const portingStep = useMemo(() => {
    return subscription?.porting ? nextPortingStep(subscription?.porting) : null
  }, [subscription?.porting])

  useEffect(() => {
    if (
      subscription?.porting &&
      hasAllRequiredFieldsCompleted(subscription.porting) &&
      !subscription.porting.declinedCode
    ) {
      onCompleted(subscription.porting) // handles the case of coming back to a Porting when the required porting fields have been filled out
      onPortingStep?.(null)
    } else {
      onPortingStep?.(portingStep)
    }
  }, [subscription?.porting, onCompleted, onPortingStep, portingStep])

  if (!subscription) {
    return null
  }

  if (!subscription.porting) {
    console.error('Subscription has no porting')
    return null
  }

  const handleSubmit = async (portingData: UpdatePortingValues) => {
    try {
      setSubmitting(true)
      const porting = await updatePorting(subscription.porting!.id, portingData)

      if (hasAllRequiredFieldsCompleted(porting)) {
        onCompleted(porting)
        onPortingStep?.(portingStep)
        return
      }

      await refetch()
    } catch (e) {
      console.error(e)
      setPortingUpdateError(
        e instanceof ApiError ? e.message : 'Something went wrong.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View>
      {portingStep === 'carrierDetails' && (
        <CarrierInfoForm
          porting={subscription.porting}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={portingUpdateError}
        />
      )}
      {portingStep === 'holderDetails' && (
        <AccountHolderForm
          porting={subscription.porting}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={portingUpdateError}
        />
      )}
      {portingStep === 'address' && (
        <AddressForm
          porting={subscription.porting}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={portingUpdateError}
        />
      )}
      {portingStep === 'donorApproval' && (
        <DonorApprovalForm
          porting={subscription.porting}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={portingUpdateError}
        />
      )}
      {subscription.porting.declinedCode &&
        portingStep === 'protectionDisabling' && (
          <ProtectionDisabling
            onConfirmRequestAgain={async () => {
              assert(subscription?.porting, 'No subscription or porting')
              const porting = await updatePorting(subscription.porting.id, {})
              onCompleted(porting)
            }}
            declinedCode={subscription.porting.declinedCode}
          />
        )}
      {subscription.porting.declinedCode && portingStep === null && (
        <GenericPortingDeclined
          declinedCode={subscription.porting.declinedCode}
          onSupportRequested={onSupportRequested}
        />
      )}
    </View>
  )
}
