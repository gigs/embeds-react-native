import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { AddressInfo } from '../../../../src/PortingEmbed/features/Address/AddressInfo'

const meta = {
  title: 'AddressInfo',
  component: AddressInfo,
  args: {
    onChangeAddressLine1: (value) =>
      console.log(`Address Line 1 changed: ${value}`),
    onChangeAddressLine2: (value) =>
      console.log(`Address Line 2 changed ${value}`),
    onChangeCity: (value) => console.log(`City changed ${value}`),
    onChangePostalCode: (value) => console.log(`Postal Code changed ${value}`),
    onChangeCountry: (value) => console.log(`Country changed ${value}`),
    onChangeState: (value) => console.log(`State changed ${value}`),
  },
  decorators: [
    (Story) => (
      <SafeAreaView
        style={{
          backgroundColor: '#f5f5f5',
          padding: 16,
        }}
      >
        <Story />
      </SafeAreaView>
    ),
  ],
} satisfies Meta<typeof AddressInfo>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const WithInvalidZip: Story = {
  args: {
    declinedCode: 'portingZipCodeRequiredOrInvalid',
  },
}
export const WithInvalidAddress: Story = {
  args: {
    declinedCode: 'portingAddressRequiredOrInvalid',
  },
}
