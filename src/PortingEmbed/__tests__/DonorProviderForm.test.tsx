import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'
import React from 'react'
import { Button } from 'react-native'

import { connectSession } from '../../../testing/fixtures/connectSession'
import { porting } from '../../../testing/fixtures/porting'
import { ConnectSessionContext } from '../../core/ConnectSessionProvider'
import { CustomOptionsContext } from '../CustomOptionsProvider'
import { DonorProviderForm } from '../features/DonorProvider/DonorProviderForm'

describe('DonorProviderForm', () => {
  const onSaveMock = jest.fn()

  it('disables the button', async () => {
    render(
      <ConnectSessionContext.Provider
        value={{
          connectSession: {
            ...connectSession,
            intent: {
              completePorting: {
                subscription: 'sub_456',
              },
              type: 'completePorting',
            },
          },
          project: 'dev',
          token: '123445',
        }}
      >
        <DonorProviderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, donorProvider: null }}
        />
      </ConnectSessionContext.Provider>
    )
    const button = await screen.findByText('Save')

    expect(button).toBeDisabled()
    fireEvent.press(button)

    await waitFor(() => {
      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })
  it('enables the button on selection', async () => {
    render(
      <ConnectSessionContext.Provider
        value={{
          connectSession: {
            ...connectSession,
            intent: {
              completePorting: {
                subscription: 'sub_456',
              },
              type: 'completePorting',
            },
          },
          project: 'dev',
          token: '123445',
        }}
      >
        <DonorProviderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, donorProvider: null }}
        />
      </ConnectSessionContext.Provider>
    )
    const dropdown = await screen.findByText('Current Carrier')
    expect(dropdown).toBeOnTheScreen()

    fireEvent.press(dropdown)

    const provider = screen.getByText('AT&T')
    fireEvent.press(provider)

    const button = screen.getByText('Save')

    expect(button).not.toBeDisabled()
    fireEvent.press(button)
    expect(onSaveMock).toHaveBeenCalled()
  })
  it('renders validation errors if the button has no disabled prop', async () => {
    render(
      <ConnectSessionContext.Provider
        value={{
          connectSession: {
            ...connectSession,
            intent: {
              completePorting: {
                subscription: 'sub_456',
              },
              type: 'completePorting',
            },
          },
          project: 'dev',
          token: '123445',
        }}
      >
        <CustomOptionsContext.Provider
          value={{
            renderPrimaryButton: (onPress, _name, isSubmitting) => (
              <Button
                title={isSubmitting ? 'Loading...' : 'Submit'}
                onPress={onPress}
              />
            ),
          }}
        >
          <DonorProviderForm
            onSubmit={onSaveMock}
            porting={{ ...porting, donorProvider: null }}
          />
        </CustomOptionsContext.Provider>
      </ConnectSessionContext.Provider>
    )

    const button = await screen.findByText('Submit')

    expect(button).toBeOnTheScreen()
    expect(button).not.toBeDisabled()
    fireEvent.press(button)

    const error = screen.getByText('Please select an option.')

    expect(onSaveMock).not.toHaveBeenCalled()
    expect(error).toBeOnTheScreen()
  })
})
