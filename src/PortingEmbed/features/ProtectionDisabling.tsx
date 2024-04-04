import { useState } from 'react'
import { View } from 'react-native'

import { PortingDeclinedCode } from '../../../types/porting'
import { AlertBanner } from '../../components/AlertBanner'
import { EmbedButton } from '../../components/EmbedButton'
import { EmbedText } from '../../components/EmbedText'
import { EmbedTextButton } from '../../components/EmbedTextButton'
import { useOptionsContext } from '../CustomOptionsProvider'
import { portingDeclinedMessage } from '../util/portingUtils'

type Props = {
  onConfirmRequestAgain: () => void
  declinedCode: PortingDeclinedCode
}

export function ProtectionDisabling({
  onConfirmRequestAgain,
  declinedCode,
}: Props) {
  const [confirmationVisible, setConfirmationVisible] = useState<boolean>(false)
  const options = useOptionsContext()

  if (options?.renderPortingProtectionDisabledConfirmation) {
    return options?.renderPortingProtectionDisabledConfirmation(
      onConfirmRequestAgain
    )
  }

  return confirmationVisible ? (
    <PortingProtectionConfirmation
      onClickedConfirm={onConfirmRequestAgain}
      onClickedCancel={() => setConfirmationVisible(false)}
    />
  ) : (
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
        {options?.renderPrimaryButton ? (
          options.renderPrimaryButton(
            () => setConfirmationVisible(true),
            'protectionDisabling.button'
          )
        ) : (
          <EmbedButton
            onPress={() => setConfirmationVisible(true)}
            name="Request Porting Again"
          />
        )}
      </View>
    </View>
  )
}

type ConfirmationProps = {
  onClickedConfirm: () => void
  onClickedCancel: () => void
}

function PortingProtectionConfirmation({
  onClickedConfirm,
  onClickedCancel,
}: ConfirmationProps) {
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
      {options?.renderTitle?.('protectionDisabling')}
      <EmbedText>
        Once you receive confirmation that the port protection has been disabled
        and your number is ready for porting, please let us know by clicking the
        button below to confirm.
      </EmbedText>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-evenly',
            marginTop: 32,
          },
        ]}
      >
        {options?.renderPrimaryButton ? (
          options.renderPrimaryButton(
            onClickedConfirm,
            'protectionDisabling.confirm'
          )
        ) : (
          <EmbedButton onPress={onClickedConfirm}>Confirm</EmbedButton>
        )}
        {options?.renderSecondaryButton ? (
          options.renderSecondaryButton(
            'protectionDisabling.cancel',
            onClickedCancel
          )
        ) : (
          <EmbedTextButton onPress={onClickedCancel}>Cancel</EmbedTextButton>
        )}
      </View>
    </View>
  )
}
