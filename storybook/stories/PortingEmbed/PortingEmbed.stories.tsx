import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import { PortingEmbed } from '../../../src'
import { connectSession } from '../../../testing/fixtures/connectSession'

const meta = {
  title: 'PortingEmbed',
  component: PortingEmbed,
  args: {
    connectSession,
    project: 'dev',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PortingEmbed>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
