import React from 'react'
import { View } from 'react-native'

import { useOptionsContext } from '../PortingEmbed/CustomOptionsProvider'
import { EmbedText } from './EmbedText'

type Props = {
  variant: 'info' | 'error'
  message: string
}

export function AlertBanner({ variant, message }: Props) {
  const options = useOptionsContext()

  const colors: Record<string, string> = {
    'info.background': 'transparent',
    'info.text': '#091723',
    'error.background': '#FFE4E6',
    'error.text': '#BE123C',
  }

  return options?.renderAlertBanner ? (
    options.renderAlertBanner(variant, message)
  ) : (
    <View
      style={[
        {
          borderRadius: 8,
          padding: 16,
          backgroundColor: colors[`${variant}.background`],
          flexDirection: 'row',
          borderColor: '#d1d5db',
          borderWidth: variant === 'info' ? 1 : 0,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        },
      ]}
    >
      <EmbedText
        style={{
          fontSize: 14,
          lineHeight: 16,
          flex: 1,
          flexWrap: 'wrap',
          fontWeight: variant === 'error' ? '700' : 'normal',
          color: colors[`${variant}.text`],
        }}
      >
        {message}
      </EmbedText>
    </View>
  )
}
