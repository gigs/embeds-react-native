import React, { useState } from 'react'
import { View } from 'react-native'

import { Porting } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { EmbedButton } from '../../../components/EmbedButton'
import { declinedPortingRequiresCarrierInfo } from '../../util/portingUtils'
import { CarrierDetailsInfo } from './CarrierDetailsInfo'

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

  function handleSave() {
    onSubmit(formData)
  }

  const isValid =
    formData.accountNumber.length > 0 && formData.accountPin.length > 0

  return (
    <View>
      {error && <AlertBanner variant="error" message={error} />}
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
