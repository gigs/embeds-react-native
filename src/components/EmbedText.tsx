import { Text, TextProps } from 'react-native'

import { useOptionsContext } from '../PortingEmbed/CustomOptionsProvider'

type Props = {
  children: React.ReactNode
} & TextProps

export const EmbedText = (props: Props) => {
  const { style, children } = props
  const options = useOptionsContext()

  return (
    <Text
      style={[
        style,
        options?.defaultTextFont ? { fontFamily: options.defaultTextFont } : {},
      ]}
    >
      {children}
    </Text>
  )
}
