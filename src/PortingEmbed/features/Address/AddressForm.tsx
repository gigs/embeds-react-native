import React, { useState } from 'react'
import { View } from 'react-native'
import { z } from 'zod'
import { ZodError } from 'zod'

import { Porting } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { EmbedButton } from '../../../components/EmbedButton'
import { declinedPortingRequiresAddress } from '../../util/portingUtils'
import { AddressInfo } from './AddressInfo'

const schema = z.object({
  address: z.object({
    line1: z
      .string()
      .trim()
      .min(1, 'Line 1 is required')
      .max(35, 'Line 1 must not exceed 35 characters')
      .optional(),
    line2: z
      .string()
      .trim()
      .max(35, 'Must not exceed 35 characters')
      .optional()
      .transform((line2) => line2 || null)
      .nullable(),
    city: z.string().trim().min(1, 'City is required').optional(),
    postalCode: z.string().trim().optional(),
    state: z.string().nullable().optional(),
    country: z.string().trim().min(1, 'Country is required').optional(),
  }),
})

type AddressFormProps = {
  porting: Porting
  onSubmit: (porting: {
    address: {
      line1: string
      line2?: string
      city: string
      state?: string
      postalCode?: string
      country: string
    }
  }) => unknown
  isSubmitting?: boolean
  error?: string
}

export function AddressForm({
  porting,
  onSubmit,
  isSubmitting,
  error,
}: AddressFormProps) {
  const [formData, setFormData] = useState({
    address: {
      line1: porting.address?.line1 || '',
      line2: porting.address?.line2 || undefined,
      city: porting.address?.city || '',
      state: porting.address?.state || undefined,
      country: porting.address?.country || '',
      postalCode: porting.address?.postalCode || undefined,
    },
  })

  const [validationErrors, setValidationErrors] = useState<string | null>(null)

  function handleSave() {
    try {
      schema.parse(formData)
      onSubmit(formData)
    } catch (err) {
      if (err instanceof ZodError) {
        const errorsToDisplay = err.errors.map((e) => e.message)
        console.log(err)

        setValidationErrors(`${errorsToDisplay.join('. ')}.`)
      }
    }
  }

  const isValid =
    formData.address.line1.length > 0 &&
    formData.address.city.length > 0 &&
    formData.address.country.length > 0

  return (
    <View>
      {error && <AlertBanner variant="error" message={error} />}
      {validationErrors && (
        <AlertBanner variant="error" message={validationErrors} />
      )}
      <AddressInfo
        onChangeAddressLine1={(line1) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, line1: line1.trim() },
          }))
        }
        onChangeAddressLine2={(line2) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, line2: line2.trim() },
          }))
        }
        onChangeCity={(city) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, city: city.trim() },
          }))
        }
        onChangeCountry={(country) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, country: country.trim() },
          }))
        }
        onChangePostalCode={(postalCode) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, postalCode: postalCode.trim() },
          }))
        }
        onChangeState={(state) =>
          setFormData((prev) => ({
            ...prev,
            address: { ...prev.address, state: state.trim() },
          }))
        }
        declinedCode={
          declinedPortingRequiresAddress(porting)
            ? porting.declinedCode
            : undefined
        }
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
