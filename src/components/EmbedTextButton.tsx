import React, { ReactNode } from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'

import { EmbedText } from './EmbedText'

type Props = {
  children: ReactNode
} & TouchableOpacityProps

export function EmbedTextButton({ children, ...rest }: Props) {
  return (
    <TouchableOpacity {...rest}>
      <EmbedText
        style={[
          {
            color: '#007AEC',
            fontSize: 16,
            textAlign: 'center',
            fontWeight: '700',
          },
        ]}
      >
        {children}
      </EmbedText>
    </TouchableOpacity>
  )
}
