import React, { useState } from 'react'
import { View } from 'react-native'

import { Porting } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { EmbedButton } from '../../../components/EmbedButton'
import { AccountHolderInfo } from './../../features/AccountHolder/AccountHolderInfo'

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

  function handleSave() {
    onSubmit(formData)
  }
  const isValid =
    (!porting.required.includes('birthday') ||
      (formData.birthday && formData.birthday?.length > 0)) &&
    formData.firstName.length > 0 &&
    formData.lastName.length > 0

  return (
    <View>
      {error && <AlertBanner variant="error" message={error} />}
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
