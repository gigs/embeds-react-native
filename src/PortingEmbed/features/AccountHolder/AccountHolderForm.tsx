import React, { useState } from 'react'
import { View } from 'react-native'
import { z, ZodError } from 'zod'

import { Porting } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { EmbedButton } from '../../../components/EmbedButton'
import { AccountHolderInfo } from './../../features/AccountHolder/AccountHolderInfo'

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Account Holder’s First Name is required'),
  lastName: z.string().trim().min(1, 'Account Holder’s Last Name is required'),
  birthday: z
    .string()
    .trim()
    .min(1, 'Account Holder’s Date of Birth is required')
    .optional(),
})

type AccountHolderFormProps = {
  porting: Porting
  onSubmit: (porting: {
    firstName: string
    lastName: string
    birthday?: string
  }) => unknown
  isSubmitting?: boolean
  error?: string
}

export function AccountHolderForm({
  porting,
  onSubmit,
  isSubmitting,
  error,
}: AccountHolderFormProps) {
  const [formData, setFormData] = useState({
    firstName: porting.firstName || '',
    lastName: porting.lastName || '',
    birthday: porting.birthday || undefined,
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
    (!porting.required.includes('birthday') ||
      (formData.birthday && formData.birthday?.length > 0)) &&
    formData.firstName.length > 0 &&
    formData.lastName.length > 0

  return (
    <View>
      {error && <AlertBanner variant="error" message={error} />}
      {validationErrors && (
        <AlertBanner variant="error" message={validationErrors} />
      )}
      <AccountHolderInfo
        onChangeFirstName={(firstName) =>
          porting.required.includes('firstName') &&
          setFormData((prev) => ({ ...prev, firstName: firstName.trim() }))
        }
        onChangeLastName={(lastName) =>
          porting.required.includes('lastName') &&
          setFormData((prev) => ({ ...prev, lastName: lastName.trim() }))
        }
        onChangeBirthday={(birthday) => {
          setFormData((prev) => ({
            ...prev,
            birthday: birthday.trim(),
          }))
        }}
        fields={porting.required}
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
