import React from 'react'
import { View } from 'react-native'

import { PortingDeclinedCode } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { Input } from '../../../components/Input'
import { PortingInfoTextButton } from '../../../components/PortingInfoTextButton'
import { useOptionsContext } from '../../CustomOptionsProvider'
import { portingDeclinedMessage } from '../../util/portingUtils'

type Props = {
  onChangeAccountNumber: (value: string) => void
  onChangeAccountPin: (value: string) => void
  declinedCode?: PortingDeclinedCode
}

export function CarrierDetailsInfo({
  onChangeAccountNumber,
  onChangeAccountPin,
  declinedCode,
}: Props) {
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
      {options?.renderTitle?.('carrierDetails')}
      {declinedCode && (
        <AlertBanner
          variant="error"
          message={portingDeclinedMessage(declinedCode)}
        />
      )}
      <View>
        {options?.renderInput ? (
          options?.renderInput?.(
            'carrierDetails.number',
            onChangeAccountNumber,
            'numeric'
          )
        ) : (
          <Input
            placeholder="Account Number"
            onChangeText={(value: string) => onChangeAccountNumber(value)}
            inputMode="numeric"
          />
        )}

        {options?.renderInput ? (
          options?.renderInput?.(
            'carrierDetails.pin',
            onChangeAccountPin,
            'numeric'
          )
        ) : (
          <Input
            placeholder="Number Transfer PIN"
            onChangeText={(value: string) => onChangeAccountPin(value)}
            inputMode="numeric"
          />
        )}
      </View>
      <View
        style={[
          {
            marginTop: 24,
          },
        ]}
      >
        <PortingInfoTextButton />
      </View>
    </View>
  )
}
