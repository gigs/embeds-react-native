import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { CarrierDetailsInfo } from '../../../../src/PortingEmbed/features/CarrierDetails/CarrierDetailsInfo'

const meta = {
  title: 'CarrierDetails',
  component: CarrierDetailsInfo,
  args: {
    onChangeAccountNumber: (value: string) =>
      console.log(`Account number changed: ${value}`),
    onChangeAccountPin: (value: string) =>
      console.log(`Account PIN changed ${value}`),
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
} satisfies Meta<typeof CarrierDetailsInfo>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const DeclinedWithInvalidCode: Story = {
  args: {
    declinedCode: 'portingAccountNumberRequiredOrInvalid',
  },
}
export const DeclinedWithInvalidPin: Story = {
  args: {
    declinedCode: 'portingAccountPinRequiredOrInvalid',
  },
}
