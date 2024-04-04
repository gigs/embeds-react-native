import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { DonorApprovalInfo } from '../../../../src/PortingEmbed/features/DonorApproval/DonorApprovalInfo'

const meta = {
  title: 'DonorApproval',
  component: DonorApprovalInfo,
  args: {
    onCheckedDonorApproval: (value: boolean) =>
      console.log(`Checked: ${value}`),
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
} satisfies Meta<typeof DonorApprovalInfo>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
