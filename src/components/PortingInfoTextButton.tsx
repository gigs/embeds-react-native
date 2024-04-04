import { Linking } from 'react-native'

import { useOptionsContext } from '../PortingEmbed/CustomOptionsProvider'
import { EmbedTextButton } from './EmbedTextButton'

export function PortingInfoTextButton() {
  const options = useOptionsContext()
  return options?.renderSecondaryButton ? (
    options.renderSecondaryButton('portingInfoLink', async () => {
      await Linking.openURL(
        'https://connect.gigs.com/port-in-instructions/t-mobile'
      )
    })
  ) : (
    <EmbedTextButton
      style={[{ marginTop: 24 }]}
      onPress={async () => {
        await Linking.openURL(
          'https://connect.gigs.com/port-in-instructions/t-mobile'
        )
      }}
    >
      How to find your number porting information?
    </EmbedTextButton>
  )
}
