import React, { useState } from 'react'
import { View } from 'react-native'
import { z, ZodError } from 'zod'

import { Porting } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { EmbedButton } from '../../../components/EmbedButton'
import { declinedPortingRequiresCarrierInfo } from '../../util/portingUtils'
import { CarrierDetailsInfo } from './CarrierDetailsInfo'

const schema = z.object({
  accountNumber: z.string().trim().min(1, 'Account Number is required'),
  accountPin: z.string().trim().min(1, 'Number Transfer PIN is required'),
})

type CarrierInfoFormProps = {
  porting: Porting
  onSubmit: (porting: { accountNumber: string; accountPin: string }) => unknown
  isSubmitting?: boolean
  error?: string
}

export function CarrierInfoForm({
  porting,
  onSubmit,
  isSubmitting,
  error,
}: CarrierInfoFormProps) {
  const [formData, setFormData] = useState({
    accountNumber: porting.accountNumber || '',
    accountPin: '',
  })

  const [validationErrors, setValidationErrors] = useState<string | null>(null)

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

  const isValid =
    formData.accountNumber.length > 0 && formData.accountPin.length > 0

  return (
    <View>
      {error && <AlertBanner variant="error" message={error} />}
      {validationErrors && (
        <AlertBanner variant="error" message={validationErrors} />
      )}
      <CarrierDetailsInfo
        onChangeAccountNumber={(accountNumber) =>
          setFormData((prev) => ({
            ...prev,
            accountNumber: accountNumber.trim(),
          }))
        }
        onChangeAccountPin={(accountPin) =>
          setFormData((prev) => ({ ...prev, accountPin: accountPin.trim() }))
        }
        declinedCode={
          declinedPortingRequiresCarrierInfo(porting)
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
