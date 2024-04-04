import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { AlertBanner } from '../../src/components/AlertBanner'

const meta = {
  title: 'AlertBanner',
  component: AlertBanner,
  args: {},
  decorators: [
    (Story) => (
      <SafeAreaView>
        <Story />
      </SafeAreaView>
    ),
  ],
} satisfies Meta<typeof AlertBanner>

export default meta

type Story = StoryObj<typeof meta>

export const InfoAlert: Story = {
  args: {
    message: 'Some information I want to convey to the user.',
    variant: 'info',
  },
}

export const ErrorAlert: Story = {
  args: {
    message: 'Something went wrong.',
    variant: 'error',
  },
}
