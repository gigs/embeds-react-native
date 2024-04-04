import React, { ReactNode } from 'react'
import { Pressable, PressableProps } from 'react-native'

import { EmbedText } from './EmbedText'

type Props = {
  children: ReactNode
} & PressableProps

export function EmbedTextButton({ children, ...rest }: Props) {
  return (
    <Pressable {...rest}>
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
    </Pressable>
  )
}
