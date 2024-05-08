import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { useOptionsContext } from '../PortingEmbed/CustomOptionsProvider'
import { EmbedText } from './EmbedText'

type Props = {
  onPress: () => unknown
  disabled?: boolean
  isSubmitting?: boolean
  name?: string
} & TouchableOpacityProps

export function EmbedButton({
  onPress,
  disabled,
  isSubmitting,
  name,
  ...rest
}: Props) {
  const options = useOptionsContext()

  return options?.renderPrimaryButton ? (
    options.renderPrimaryButton(onPress, name, isSubmitting, disabled)
  ) : (
    <TouchableOpacity
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? '#94C4F2' : '#007AEC',
          borderRadius: 8,
          padding: 12,
        },
      ]}
      onPress={onPress}
      {...rest}
    >
      <EmbedText
        style={[
          {
            color: 'white',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: '700',
          },
        ]}
      >
        {name}
      </EmbedText>
    </TouchableOpacity>
  )
}
