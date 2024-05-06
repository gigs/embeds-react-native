import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { EmbedText } from './EmbedText'

interface CheckboxProps {
  onChecked: (checked: boolean) => void
  label: string
}

export function FakeCheckBox({ onChecked, label }: CheckboxProps) {
  const [checked, setChecked] = useState(false)

  const toggleCheckbox = () => {
    setChecked(!checked)
    onChecked(!checked)
  }

  return (
    <TouchableOpacity onPress={toggleCheckbox} style={[styles.container]}>
      <View style={[styles.checkbox, checked ? styles.checked : null]} />
      <EmbedText style={[{ fontSize: 16, marginLeft: 12 }]}>{label}</EmbedText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#1f2937',
    borderRadius: 4,
    marginRight: 8,
  },
  checked: {
    backgroundColor: '#1f2937',
  },
})
