import { Text, TextProps } from 'react-native'

type Props = {
  children: React.ReactNode
} & TextProps

export const EmbedText = (props: Props) => {
  const { style, children } = props

  return (
    <Text style={[style, { fontFamily: 'Satoshi-Regular' }]}>{children}</Text>
  )
}
