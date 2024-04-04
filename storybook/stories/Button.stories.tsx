import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { EmbedButton } from '../../src/components/EmbedButton'

const meta = {
  title: 'EmbedButton',
  component: EmbedButton,
  args: {},
  decorators: [
    (Story) => (
      <SafeAreaView>
        <Story />
      </SafeAreaView>
    ),
  ],
} satisfies Meta<typeof EmbedButton>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    children: 'Submit',
    onPress: () => console.log('Pressed'),
  },
}
