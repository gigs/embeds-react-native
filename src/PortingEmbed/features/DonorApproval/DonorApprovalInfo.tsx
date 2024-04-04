import React from 'react'
import { View } from 'react-native'

import { FakeCheckBox } from '../../../components/FakeCheckBox'
import { useOptionsContext } from '../../CustomOptionsProvider'

type Props = {
  onCheckedDonorApproval: (checked: boolean) => void
}

export function DonorApprovalInfo({ onCheckedDonorApproval }: Props) {
  const options = useOptionsContext()

  return (
    <View
      style={[
        {
          marginTop: 12,
          marginBottom: 42,
        },
      ]}
    >
      {options?.renderTitle?.('donorApproval')}
      {options?.renderCheckbox ? (
        options?.renderCheckbox(onCheckedDonorApproval)
      ) : (
        <FakeCheckBox
          onChecked={onCheckedDonorApproval}
          label="I have notified my current provider of the number porting and got the
        approval that the number can be ported."
        />
      )}
    </View>
  )
}
