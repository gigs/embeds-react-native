import { fireEvent, render, screen } from '@testing-library/react-native'
import { Button, Text, TextInput, View } from 'react-native'

import { porting } from '../../../testing/fixtures/porting'
import { CustomOptionsContext } from '../CustomOptionsProvider'
import { AddressForm } from '../features/Address/AddressForm'

describe('AddressForm', () => {
  const onSaveMock = jest.fn()
  describe('when the form is missing all required address fields', () => {
    it('disables the button', async () => {
      render(
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      )
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)
      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })
  describe('when the form has missing required address fields', () => {
    it('disables the button', () => {
      render(
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      )
      const input = screen.getByText('Street Address')
      fireEvent.changeText(input, 'Coconut Grove')
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)
      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })
  describe('when the form has no missing fields', () => {
    it('calls onSubmit function', async () => {
      render(
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      )

      const streetInput = screen.getByText('Street Address')
      fireEvent.changeText(streetInput, 'Coconut Grove')
      const cityInput = screen.getByText('City')
      fireEvent.changeText(cityInput, 'Miami')
      const countryInput = screen.getByText('Country')
      fireEvent.changeText(countryInput, 'United States')

      const button = screen.getByText('Save')

      expect(button).not.toBeDisabled()
      fireEvent.press(button)

      expect(onSaveMock).toHaveBeenCalledWith({
        address: {
          city: 'Miami',
          country: 'United States',
          line1: 'Coconut Grove',
          line2: undefined,
          postalCode: undefined,
          state: undefined,
        },
      })
    })
  })

  it('uses the custom styles and text if present', () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderTitle: () => (
            <Text style={[{ fontSize: 24, fontWeight: 'bold', color: 'red' }]}>
              Custom address title
            </Text>
          ),
        }}
      >
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const title = screen.getByText('Custom address title')

    expect(title).toBeOnTheScreen()
    expect(title).toHaveStyle({
      fontSize: 24,
      fontWeight: 'bold',
      color: 'red',
    })
  })

  it('uses the custom input if present', async () => {
    const placeholders: Record<string, string> = {
      'address.line1': 'Coconut Grove',
      'address.line2': 'Some Apt.',
      'address.city': 'Miami',
      'address.postalCode': '00000',
      'address.state': 'Florida',
      'address.country': 'USA',
    }

    render(
      <CustomOptionsContext.Provider
        value={{
          renderInput: (name, onChangeText) => (
            <TextInput
              onChangeText={onChangeText}
              placeholder={placeholders[name]}
            />
          ),
        }}
      >
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const line1Input = await screen.findByPlaceholderText('Coconut Grove')
    const line2Input = await screen.findByPlaceholderText('Some Apt.')
    const cityInput = await screen.findByPlaceholderText('Miami')
    const postalCodeInput = await screen.findByPlaceholderText('00000')
    const stateInput = await screen.findByPlaceholderText('Florida')
    const countryInput = await screen.findByPlaceholderText('USA')

    expect(line1Input).toBeOnTheScreen()
    expect(line2Input).toBeOnTheScreen()
    expect(cityInput).toBeOnTheScreen()
    expect(postalCodeInput).toBeOnTheScreen()
    expect(stateInput).toBeOnTheScreen()
    expect(countryInput).toBeOnTheScreen()
  })
  it('uses the custom button if present', async () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderPrimaryButton: (onPress, _name, isSubmitting, disabled) => (
            <Button
              title={isSubmitting ? 'Loading...' : 'Submit'}
              onPress={onPress}
              disabled={disabled}
            />
          ),
        }}
      >
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const button = screen.getByText('Submit')
    expect(button).toBeOnTheScreen()
    expect(button).toBeDisabled()

    const streetInput = screen.getByText('Street Address')
    fireEvent.changeText(streetInput, 'Coconut Grove')
    const cityInput = screen.getByText('City')
    fireEvent.changeText(cityInput, 'Miami')
    const countryInput = screen.getByText('Country')
    fireEvent.changeText(countryInput, 'United States')

    expect(button).not.toBeDisabled()
    fireEvent.press(button)

    expect(onSaveMock).toHaveBeenCalledWith({
      address: {
        city: 'Miami',
        country: 'United States',
        line1: 'Coconut Grove',
        line2: undefined,
        postalCode: undefined,
        state: undefined,
      },
    })
  })
  it('uses the custom porting instructions button if present', async () => {
    const placeholders: Record<string, string> = {
      portingInfoLink: 'Porting instructions',
    }
    const onPressLink = jest.fn()

    render(
      <CustomOptionsContext.Provider
        value={{
          renderSecondaryButton: (name, _onPress) => (
            <Button onPress={onPressLink} title={placeholders[name]!} />
          ),
        }}
      >
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const portingInstructionsButton = await screen.findByText(
      'Porting instructions'
    )

    expect(portingInstructionsButton).toBeOnTheScreen()

    fireEvent.press(portingInstructionsButton)
    expect(onPressLink).toBeCalled()
  })
  it('displays the info alert', () => {
    render(
      <AddressForm
        onSubmit={onSaveMock}
        porting={{ ...porting, address: null }}
      />
    )
    const banner = screen.getByText(
      "It's important that this address matches the address your current provider has on file."
    )
    expect(banner).toBeOnTheScreen()
  })
  it('uses the custom info alert if present', () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderAlertBanner: (variant, message) => (
            <View>
              <Text style={[{ color: variant === 'info' ? 'orange' : 'red' }]}>
                {message}
              </Text>
            </View>
          ),
        }}
      >
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const banner = screen.getByText(
      "It's important that this address matches the address your current provider has on file."
    )
    expect(banner).toBeOnTheScreen()
    expect(banner).toHaveStyle({
      color: 'orange',
    })
  })
  it('displays an alert on error', () => {
    render(
      <AddressForm
        onSubmit={onSaveMock}
        porting={{ ...porting, address: null }}
        error="Something went very wrong."
      />
    )
    const banner = screen.getByText('Something went very wrong.')
    expect(banner).toBeOnTheScreen()
  })
  it('uses the custom alert on error if present', () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderAlertBanner: (variant, message) => (
            <View>
              <Text style={[{ color: variant === 'error' ? 'red' : 'orange' }]}>
                {message}
              </Text>
            </View>
          ),
        }}
      >
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
          error="Something went very wrong."
        />
      </CustomOptionsContext.Provider>
    )
    const banner = screen.getByText('Something went very wrong.')
    expect(banner).toBeOnTheScreen()
    expect(banner).toHaveStyle({
      color: 'red',
    })
  })
  it('uses the default font if present', async () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          defaultTextFont: 'Custom-font',
        }}
      >
        <AddressForm
          onSubmit={onSaveMock}
          porting={{ ...porting, address: null }}
          error="Something went very wrong."
        />
      </CustomOptionsContext.Provider>
    )

    const button = screen.getByText('Save')

    expect(button).toHaveStyle({
      fontFamily: 'Custom-font',
    })
  })
})
