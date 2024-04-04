import React from 'react'
import { View } from 'react-native'

import { PortingDeclinedCode } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { Input } from '../../../components/Input'
import { PortingInfoTextButton } from '../../../components/PortingInfoTextButton'
import { useOptionsContext } from '../../CustomOptionsProvider'
import { portingDeclinedMessage } from '../../util/portingUtils'

type Props = {
  onChangeAddressLine1: (value: string) => void
  onChangeAddressLine2: (value: string) => void
  onChangeCity: (value: string) => void
  onChangePostalCode: (value: string) => void
  onChangeState: (value: string) => void
  onChangeCountry: (value: string) => void
  declinedCode?: PortingDeclinedCode
}

export function AddressInfo({
  onChangeAddressLine1,
  onChangeAddressLine2,
  onChangeCity,
  onChangePostalCode,
  onChangeState,
  onChangeCountry,
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
      {options?.renderTitle?.('address')}

      {declinedCode ? (
        <AlertBanner
          variant="error"
          message={portingDeclinedMessage(declinedCode)}
        />
      ) : (
        <AlertBanner
          variant="info"
          message="It's important that this address matches the address your current provider has on file."
        />
      )}

      <View>
        {options?.renderInput ? (
          options?.renderInput?.('address.line1', onChangeAddressLine1)
        ) : (
          <Input
            placeholder="Street Address"
            onChangeText={(value: string) => onChangeAddressLine1(value)}
            inputMode="text"
          />
        )}

        {options?.renderInput ? (
          options?.renderInput?.('address.line2', onChangeAddressLine2)
        ) : (
          <Input
            placeholder="Apt, Suite, other (optional)"
            onChangeText={(value: string) => onChangeAddressLine2(value)}
            inputMode="text"
          />
        )}

        {options?.renderInput ? (
          options?.renderInput?.('address.city', onChangeCity)
        ) : (
          <Input
            placeholder="City"
            onChangeText={(value: string) => onChangeCity(value)}
            inputMode="text"
          />
        )}

        {options?.renderInput ? (
          options?.renderInput?.('address.postalCode', onChangePostalCode)
        ) : (
          <Input
            placeholder="Postal Code"
            onChangeText={(value: string) => onChangePostalCode(value)}
            inputMode="text"
          />
        )}

        {options?.renderInput ? (
          options?.renderInput?.('address.state', onChangeState)
        ) : (
          <Input
            placeholder="State"
            onChangeText={(value: string) => onChangeState(value)}
            inputMode="text"
          />
        )}

        {options?.renderInput ? (
          options?.renderInput?.('address.country', onChangeCountry)
        ) : (
          <Input
            placeholder="Country"
            onChangeText={(value: string) => onChangeCountry(value)}
            inputMode="text"
          />
        )}
      </View>

      <PortingInfoTextButton />
    </View>
  )
}
