import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Button } from 'react-native'

import { porting } from '../../../testing/fixtures/porting'
import { FakeCheckBox } from '../../components/FakeCheckBox'
import { CustomOptionsContext } from '../CustomOptionsProvider'
import { DonorApprovalForm } from '../features/DonorApproval/DonorApprovalForm'

describe('DonorApprovalForm', () => {
  const onSaveMock = jest.fn()
  describe('when the porting required donorApproval', () => {
    it('disables the button', async () => {
      render(
        <DonorApprovalForm
          onSubmit={onSaveMock}
          porting={{
            ...porting,
            donorProviderApproval: false,
            required: ['donorProviderApproval'],
          }}
        />
      )
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)
      expect(onSaveMock).not.toHaveBeenCalled()
    })
    it('enables submit on checkbox checked', () => {
      render(
        <DonorApprovalForm
          onSubmit={onSaveMock}
          porting={{
            ...porting,
            donorProviderApproval: false,
            required: ['donorProviderApproval'],
          }}
        />
      )
      const checkbox = screen.getByText(
        'I have notified my current provider of the number porting and got the approval that the number can be ported.'
      )
      fireEvent.press(checkbox)
      const button = screen.getByText('Save')

      expect(button).not.toBeDisabled()
      fireEvent.press(button)

      expect(onSaveMock).toHaveBeenCalledWith({
        donorProviderApproval: true,
      })
    })
    it('disables submit on checkbox unchecked', () => {
      render(
        <DonorApprovalForm
          onSubmit={onSaveMock}
          porting={{
            ...porting,
            donorProviderApproval: false,
            required: ['donorProviderApproval'],
          }}
        />
      )
      const checkbox = screen.getByText(
        'I have notified my current provider of the number porting and got the approval that the number can be ported.'
      )
      fireEvent.press(checkbox)
      fireEvent.press(checkbox)
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)

      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })

  it('uses the custom checkbox component if present', () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderCheckbox: (onChecked) => (
            <FakeCheckBox
              label="I confirm that I have requested my provider approval."
              onChecked={onChecked}
            />
          ),
        }}
      >
        <DonorApprovalForm
          onSubmit={onSaveMock}
          porting={{
            ...porting,
            donorProviderApproval: false,
            required: ['donorProviderApproval'],
          }}
        />
      </CustomOptionsContext.Provider>
    )

    const checkbox = screen.getByText(
      'I confirm that I have requested my provider approval.'
    )

    expect(checkbox).toBeOnTheScreen()

    fireEvent.press(checkbox)
    const button = screen.getByText('Save')

    expect(button).not.toBeDisabled()
    fireEvent.press(button)

    expect(onSaveMock).toHaveBeenCalledWith({
      donorProviderApproval: true,
    })
  })
  it('uses the custom button if present', async () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderPrimaryButton: (onPress, _name, isSubmitting, disabled) => (
            <Button
              title={isSubmitting ? 'Loading...' : 'Save'}
              onPress={onPress}
              disabled={disabled}
            />
          ),
        }}
      >
        <DonorApprovalForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const button = screen.getByText('Save')
    expect(button).toBeOnTheScreen()
    expect(button).toBeDisabled()

    const checkbox = screen.getByText(
      'I have notified my current provider of the number porting and got the approval that the number can be ported.'
    )
    fireEvent.press(checkbox)

    expect(button).not.toBeDisabled()
    fireEvent.press(button)

    expect(onSaveMock).toHaveBeenCalledWith({
      donorProviderApproval: true,
    })
  })
  it('uses the default font if present', async () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          defaultTextFont: 'Custom-font',
        }}
      >
        <DonorApprovalForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const button = screen.getByText('Save')

    expect(button).toHaveStyle({
      fontFamily: 'Custom-font',
    })
  })
})
