import { fireEvent, render, screen } from '@testing-library/react-native'
import { Button, Text, TextInput, View } from 'react-native'

import { porting } from '../../../testing/fixtures/porting'
import { CustomOptionsContext } from '../CustomOptionsProvider'
import { CarrierInfoForm } from '../features/CarrierDetails/CarrierDetailsForm'

describe('CarrierInfoForm', () => {
  const onSaveMock = jest.fn()
  describe('when the form has missing account number and pin', () => {
    it('disables the button', async () => {
      render(
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
        />
      )
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)
      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })
  describe('when the form has missing account pin', () => {
    it('disables the button', () => {
      render(
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
        />
      )
      const input = screen.getByText('Account Number')
      fireEvent.changeText(input, '123456')
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)
      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })
  describe('when the form has no missing fields', () => {
    it('calls onSubmit function', async () => {
      render(
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
        />
      )

      const numberInput = screen.getByText('Account Number')
      fireEvent.changeText(numberInput, '123456')
      const pinInput = screen.getByText('Number Transfer PIN')
      fireEvent.changeText(pinInput, '1234')
      const button = screen.getByText('Save')

      expect(button).not.toBeDisabled()
      fireEvent.press(button)

      expect(onSaveMock).toHaveBeenCalledWith({
        accountNumber: '123456',
        accountPin: '1234',
      })
    })
  })

  it('uses the custom styles and text if present', () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderTitle: () => (
            <Text
              style={[{ fontSize: 24, fontWeight: 'bold', color: 'green' }]}
            >
              Custom carrier details title
            </Text>
          ),
        }}
      >
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
        />
      </CustomOptionsContext.Provider>
    )

    const title = screen.getByText('Custom carrier details title')

    expect(title).toBeOnTheScreen()
    expect(title).toHaveStyle({
      fontSize: 24,
      fontWeight: 'bold',
      color: 'green',
    })
  })
  it('uses the custom input if present', async () => {
    const placeholders: Record<string, string> = {
      'carrierDetails.number': 'Account Number',
      'carrierDetails.pin': 'PIN',
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
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
        />
      </CustomOptionsContext.Provider>
    )

    const numberInput = await screen.findByPlaceholderText('Account Number')
    const pinInput = await screen.findByPlaceholderText('PIN')

    expect(numberInput).toBeOnTheScreen()
    expect(pinInput).toBeOnTheScreen()
  })

  describe('with a custom primary button', () => {
    it('uses the custom button', async () => {
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
          <CarrierInfoForm
            onSubmit={onSaveMock}
            porting={{ ...porting, address: null }}
          />
        </CustomOptionsContext.Provider>
      )

      const button = screen.getByText('Submit')
      expect(button).toBeOnTheScreen()
      expect(button).toBeDisabled()

      const numberInput = screen.getByText('Account Number')
      fireEvent.changeText(numberInput, '123456')
      const pinInput = screen.getByText('Number Transfer PIN')
      fireEvent.changeText(pinInput, '1234')

      expect(button).not.toBeDisabled()
      fireEvent.press(button)

      expect(onSaveMock).toHaveBeenCalledWith({
        accountNumber: '123456',
        accountPin: '1234',
      })
    })

    it('renders validation errors if the button has no disabled prop', () => {
      render(
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
          <CarrierInfoForm
            onSubmit={onSaveMock}
            porting={{ ...porting, address: null }}
          />
        </CustomOptionsContext.Provider>
      )

      const button = screen.getByText('Submit')
      expect(button).toBeOnTheScreen()
      expect(button).not.toBeDisabled()

      const numberInput = screen.getByText('Account Number')
      fireEvent.changeText(numberInput, '123456')

      expect(button).not.toBeDisabled()
      fireEvent.press(button)

      const error = screen.getByText('Number Transfer PIN is required.')

      expect(onSaveMock).not.toHaveBeenCalled()
      expect(error).toBeOnTheScreen()
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
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
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
  it('displays an alert on error', () => {
    render(
      <CarrierInfoForm
        onSubmit={onSaveMock}
        porting={{ ...porting, accountNumber: null, accountPinExists: false }}
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
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
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
        <CarrierInfoForm
          onSubmit={onSaveMock}
          porting={{ ...porting, accountNumber: null, accountPinExists: false }}
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
