import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputChangeEventData,
  TextInputProps,
} from 'react-native'

import { EmbedText } from './EmbedText'

type Props = {
  error?: string | boolean
  placeholder?: string
} & TextInputProps

export function Input({ error, placeholder, ...rest }: Props) {
  const [inputText, setInputText] = useState('')
  const animatedValue = useRef(new Animated.Value(0))

  const returnAnimatedLabelStyles = {
    transform: [
      {
        translateY: animatedValue?.current?.interpolate({
          inputRange: [0, 1],
          outputRange: [44, 34],
          extrapolate: 'clamp',
        }),
      },
    ],
    fontSize: animatedValue?.current?.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
      extrapolate: 'clamp',
    }),
  }

  useEffect(() => {
    if (inputText.length > 0) {
      Animated.timing(animatedValue?.current, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(animatedValue?.current, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start()
    }
  }, [inputText])

  const styles = StyleSheet.create({
    textStyle: {
      fontSize: 16,
      lineHeight: 20,
      height: 60,
      marginTop: 4,
      padding: 16,
      paddingTop: inputText ? 30 : 14,
      backgroundColor: error ? '#fff1f2' : 'white',
      color: error ? '#e11d48' : '#1f2937',
      borderRadius: 8,
      fontWeight: '500',
      borderWidth: 0,
      fontFamily: 'Satoshi-Regular',
    },
  })

  return (
    <>
      <Animated.Text
        style={[
          returnAnimatedLabelStyles,
          {
            zIndex: 1,
            paddingLeft: 16,
            margin: 0,
            pointerEvents: 'none',
            color: '#6b7280',
            height: 20,
            fontFamily: 'Satoshi-Regular',
          },
        ]}
      >
        {placeholder}
      </Animated.Text>
      <TextInput
        onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>): void =>
          setInputText(e.nativeEvent.text)
        }
        style={styles.textStyle}
        placeholderTextColor={error ? '#e11d48' : '#6b7280'}
        {...rest}
      />
      {error && typeof error === 'string' && (
        <EmbedText
          style={{
            color: '#e11d48',
          }}
        >
          {error}
        </EmbedText>
      )}
    </>
  )
}
