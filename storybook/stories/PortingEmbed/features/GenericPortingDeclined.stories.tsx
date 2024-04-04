import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { GenericPortingDeclined } from '../../../../src/PortingEmbed/features/GenericPortingDeclined'

const meta = {
  title: 'GenericPortingDeclined',
  component: GenericPortingDeclined,
  args: {
    declinedCode: 'portingUserInformationMismatch',
    onSupportRequested: undefined,
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
} satisfies Meta<typeof GenericPortingDeclined>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const WithCustomerSupportCallback: Story = {
  args: {
    declinedCode: 'portingUserInformationMismatch',
    onSupportRequested: () => console.log('Clicked Customer support'),
  },
}
