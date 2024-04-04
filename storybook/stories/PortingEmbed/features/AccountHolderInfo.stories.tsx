import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { SafeAreaView } from 'react-native'

import { AccountHolderInfo } from '../../../../src/PortingEmbed/features/AccountHolder/AccountHolderInfo'

const meta = {
  title: 'AccountHolderInfo',
  component: AccountHolderInfo,
  args: {
    onChangeFirstName: (value: string) =>
      console.log(`First name changed: ${value}`),
    onChangeLastName: (value: string) =>
      console.log(`Last name changed ${value}`),
    fields: ['firstName', 'lastName'],
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
} satisfies Meta<typeof AccountHolderInfo>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {}
export const WithBirthday: Story = {
  args: {
    onChangeFirstName: (value: string) =>
      console.log(`First name changed: ${value}`),
    onChangeLastName: (value: string) =>
      console.log(`Last name changed ${value}`),
    onChangeBirthday: (value: string) =>
      console.log(`Birthday changed ${value}`),
    fields: ['firstName', 'lastName', 'birthday'],
  },
}
