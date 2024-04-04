import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { Input } from '../../src/components/Input'

const meta = {
  title: 'Input',
  component: Input,
  args: {},
  decorators: [
    (Story) => (
      <SafeAreaView style={[{ backgroundColor: '#f5f5f5', padding: 34 }]}>
        <Story />
      </SafeAreaView>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const WithError: Story = {
  args: {
    error: 'Invalid value.',
  },
}
