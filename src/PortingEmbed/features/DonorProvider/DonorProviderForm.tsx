import React, { useState } from 'react'
import { View } from 'react-native'
import { z, ZodError } from 'zod'

import { Porting, ServiceProvider } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { EmbedButton } from '../../../components/EmbedButton'
import { useGetServiceProviders } from '../../../data/api'
import { useOptionsContext } from '../../CustomOptionsProvider'
import { DonorProviderInfo } from './DonorProviderInfo'

const schema = z.object({
  donorProvider: z.string().trim().min(1, 'Please select an option'),
})

type DonorProviderFormProps = {
  porting: Porting
  onSubmit: (porting: { donorProvider: string }) => unknown
  isSubmitting?: boolean
  error?: string
}

export function DonorProviderForm({
  porting,
  onSubmit,
  isSubmitting,
  error,
}: DonorProviderFormProps) {
  const [formData, setFormData] = useState({
    donorProvider: porting.donorProvider?.id || '',
  })

  const [validationErrors, setValidationErrors] = useState<string | null>(null)

  const { data: serviceProviders, error: fetchError } = useGetServiceProviders(
    porting.provider
  )

  const options = useOptionsContext()

  if (!serviceProviders || !serviceProviders.items.length || fetchError) {
    options?.onError(fetchError || new Error('Service Providers not found.'), {
      code: 'providersNotFound',
      porting,
    })
    return null
  }

  const serviceProvidersList = serviceProviders.items.map(
    (sp: ServiceProvider) => ({
      id: sp.id,
      name: sp.name,
    })
  )

  function handleSave() {
    try {
      schema.parse(formData)
      onSubmit(formData)
    } catch (err) {
      if (err instanceof ZodError) {
        const errorsToDisplay = err.errors.map((e) => e.message)
        setValidationErrors(`${errorsToDisplay.join('. ')}.`)
      } else {
        throw err
      }
    }
  }

  const isValid = formData.donorProvider.length > 0

  return (
    <View>
      {error && <AlertBanner variant="error" message={error} />}
      {validationErrors && (
        <AlertBanner variant="error" message={validationErrors} />
      )}
      <DonorProviderInfo
        onChangeProvider={(providerId) => {
          setFormData((prev) => ({
            ...prev,
            donorProvider: providerId,
          }))
          setValidationErrors(null)
        }}
        providers={serviceProvidersList}
      />
      <EmbedButton
        onPress={handleSave}
        isSubmitting={isSubmitting}
        disabled={!isValid}
        name={isSubmitting ? 'Submitting...' : 'Save'}
      />
    </View>
  )
}
