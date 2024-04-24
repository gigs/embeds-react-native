import { View } from 'react-native'

import { Dropdown } from '../../../components/Dropdown'
import { useOptionsContext } from '../../CustomOptionsProvider'

type Props = {
  onChangeProvider: (value: string) => void
  providers: { id: string; name: string }[]
}

export function DonorProviderInfo({ onChangeProvider, providers }: Props) {
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
      {options?.renderTitle?.('donorProvider')}

      <View>
        {options?.renderDropdown ? (
          options?.renderDropdown?.(
            'donorProvider.dropdown',
            providers,
            onChangeProvider
          )
        ) : (
          <Dropdown
            options={providers}
            label="Current Carrier"
            onSelect={(provider: string) => onChangeProvider(provider)}
          />
        )}
      </View>
    </View>
  )
}
