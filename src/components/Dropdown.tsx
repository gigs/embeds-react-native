import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { ChevronDownIcon } from 'react-native-heroicons/solid'

import { EmbedText } from './EmbedText'

type DropdownOption = {
  id: string
  name: string
}

type DropdownProps = {
  label: string
  options: DropdownOption[]
  onSelect: (value: string) => void
}

export const Dropdown = ({ label, options, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  )

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleSelectOption = (value: string) => {
    onSelect(value)
    toggleDropdown()
  }

  useEffect(() => {
    onSelect('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.labelContainer}
        >
          <EmbedText style={styles.label}>{selectedItem ?? label}</EmbedText>
          <ChevronDownIcon />
        </TouchableOpacity>
        <Modal visible={isOpen} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={toggleDropdown}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={options}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      handleSelectOption(item.id)
                      setSelectedItem(item.name)
                    }}
                    style={styles.option}
                  >
                    <EmbedText>{item.name}</EmbedText>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  labelContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    position: 'relative',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    maxHeight: '40%',
    width: '90%',
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})
