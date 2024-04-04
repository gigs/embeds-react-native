import { Link, Stack } from 'expo-router'
import { StyleSheet, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Example home',
        }}
      />
      {/* @ts-expect-error */}
      <Link href="porting">Go to: PortingEmbed</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
