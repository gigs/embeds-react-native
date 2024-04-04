import { View } from 'react-native'

import { PortingDeclinedCode } from '../../../types/porting'
import { AlertBanner } from '../../components/AlertBanner'
import { EmbedButton } from '../../components/EmbedButton'
import { useOptionsContext } from '../CustomOptionsProvider'
import { portingDeclinedMessage } from '../util/portingUtils'

type Props = {
  onSupportRequested?: () => unknown
  declinedCode: PortingDeclinedCode
}

export function GenericPortingDeclined({
  onSupportRequested,
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
      <AlertBanner
        variant="error"
        message={portingDeclinedMessage(declinedCode)}
      />
      <View
        style={[
          {
            marginTop: 32,
          },
        ]}
      >
        {onSupportRequested && options?.renderPrimaryButton ? (
          options.renderPrimaryButton(
            onSupportRequested,
            'portingDeclined.button'
          )
        ) : (
          <EmbedButton onPress={onSupportRequested!} name="Customer support" />
        )}
      </View>
    </View>
  )
}
