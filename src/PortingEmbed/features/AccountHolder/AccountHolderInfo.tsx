import { View } from 'react-native'

import { PortingField } from '../../../../types/porting'
import { AlertBanner } from '../../../components/AlertBanner'
import { Input } from '../../../components/Input'
import { PortingInfoTextButton } from '../../../components/PortingInfoTextButton'
import { useOptionsContext } from '../../CustomOptionsProvider'

type Props = {
  onChangeFirstName: (value: string) => void
  onChangeLastName: (value: string) => void
  onChangeBirthday: (value: string) => void
  fields: PortingField[]
}

export function AccountHolderInfo({
  onChangeFirstName,
  onChangeLastName,
  onChangeBirthday,
  fields,
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
      {options?.renderTitle?.('holderDetails')}

      <AlertBanner
        variant="info"
        message="The account holder is the person who is the contractual owner of the number to be ported."
      />

      <View>
        {options?.renderInput ? (
          options?.renderInput?.('holderDetails.firstName', onChangeFirstName)
        ) : (
          <Input
            placeholder="Account Holder’s First Name"
            onChangeText={(value: string) => onChangeFirstName(value)}
            inputMode="text"
          />
        )}

        {options?.renderInput ? (
          options?.renderInput?.('holderDetails.lastName', onChangeLastName)
        ) : (
          <Input
            placeholder="Account Holder’s Last Name"
            onChangeText={(value: string) => onChangeLastName(value)}
            inputMode="text"
          />
        )}

        {fields.includes('birthday') &&
          (options?.renderDate ? (
            options?.renderDate('holderDetails.birthday', onChangeBirthday)
          ) : (
            <Input
              placeholder="Account Holder’s Birthday"
              onChangeText={(value: string) => {
                onChangeBirthday(value)
              }}
              inputMode="numeric"
            />
          ))}
      </View>

      <PortingInfoTextButton />
    </View>
  )
}
