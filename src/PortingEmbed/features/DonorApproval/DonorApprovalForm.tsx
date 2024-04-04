import React, { useState } from 'react'
import { View } from 'react-native'

import { Porting } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { EmbedButton } from '../../../components/EmbedButton'
import { DonorApprovalInfo } from './DonorApprovalInfo'

type CarrierInfoFormProps = {
  porting: Porting
  onSubmit: (porting: { donorProviderApproval: boolean }) => unknown
  isSubmitting?: boolean
  error?: string
}

export function DonorApprovalForm({
  porting,
  onSubmit,
  isSubmitting,
  error,
}: CarrierInfoFormProps) {
  const [formData, setFormData] = useState({
    donorProviderApproval: porting.donorProviderApproval || false,
  })

  function handleSave() {
    onSubmit(formData)
  }

  const isValid = formData.donorProviderApproval === true

  return (
    <View>
      {error && <AlertBanner variant="error" message={error} />}
      <DonorApprovalInfo
        onCheckedDonorApproval={(checked: boolean) =>
          setFormData((prev) => ({
            ...prev,
            donorProviderApproval: checked,
          }))
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
