import React from 'react'
import { Pressable, PressableProps } from 'react-native'

import { useOptionsContext } from '../PortingEmbed/CustomOptionsProvider'
import { EmbedText } from './EmbedText'

type Props = {
  onPress: () => unknown
  disabled?: boolean
  isSubmitting?: boolean
  name?: string
} & PressableProps

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
    <Pressable
      disabled={disabled}
      style={[
        {
          backgroundColor: disabled ? '#94C4F2' : '#007AEC',
          borderRadius: 8,
          padding: 12,
        },
      ]}
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
    </Pressable>
  )
}
