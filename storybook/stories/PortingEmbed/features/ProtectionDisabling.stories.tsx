import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { ProtectionDisabling } from '../../../../src/PortingEmbed/features/ProtectionDisabling'

const meta = {
  title: 'ProtectionDisabling',
  component: ProtectionDisabling,
  args: {
    declinedCode: 'portingPhoneNumberPortProtected',
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
} satisfies Meta<typeof ProtectionDisabling>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
