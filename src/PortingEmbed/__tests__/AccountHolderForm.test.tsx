import { fireEvent, render, screen } from '@testing-library/react-native'
import { Button, Text, TextInput, View } from 'react-native'

import { porting } from '../../../testing/fixtures/porting'
import { CustomOptionsContext } from '../CustomOptionsProvider'
import { AccountHolderForm } from '../features/AccountHolder/AccountHolderForm'

describe('AccountHolderForm', () => {
  const onSaveMock = jest.fn()
  describe('when the form has a missing required first and last name', () => {
    it('disables the button', async () => {
      render(
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{
            ...porting,
            firstName: null,
            lastName: null,
            required: ['firstName', 'lastName'],
          }}
        />
      )
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)
      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })
  describe('when the form has a missing required first name', () => {
    it('disables the button', () => {
      render(
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{
            ...porting,
            firstName: null,
            lastName: null,
            required: ['firstName', 'lastName'],
          }}
        />
      )
      const input = screen.getByText('Account Holder’s First Name')
      fireEvent.changeText(input, 'Jeffrey')
      const button = screen.getByText('Save')

      expect(button).toBeDisabled()
      fireEvent.press(button)
      expect(onSaveMock).not.toHaveBeenCalled()
    })
  })
  describe('when the form has no missing fields', () => {
    it('calls onSubmit function', async () => {
      render(
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
        />
      )

      const firstNameInput = screen.getByText('Account Holder’s First Name')
      fireEvent.changeText(firstNameInput, 'Jeffrey')
      const lastNameInput = screen.getByText('Account Holder’s Last Name')
      fireEvent.changeText(lastNameInput, 'Seinfeld')
      const button = screen.getByText('Save')

      expect(button).not.toBeDisabled()
      fireEvent.press(button)

      expect(onSaveMock).toHaveBeenCalledWith({
        firstName: 'Jeffrey',
        lastName: 'Seinfeld',
      })
    })
  })

  it('uses the custom styles and text if present', () => {
    render(
      <CustomOptionsContext.Provider
        value={{
          renderTitle: () => (
            <Text style={[{ fontSize: 24, fontWeight: 'bold', color: 'blue' }]}>
              Custom account holder title
            </Text>
          ),
        }}
      >
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const title = screen.getByText('Custom account holder title')

    expect(title).toBeOnTheScreen()
    expect(title).toHaveStyle({
      fontSize: 24,
      fontWeight: 'bold',
      color: 'blue',
    })
  })
  it('includes a birthday field if required', () => {
    render(
      <AccountHolderForm
        onSubmit={onSaveMock}
        porting={{
          ...porting,
          birthday: null,
          required: ['birthday'],
        }}
      />
    )

    const input = screen.getByText('Account Holder’s Birthday')
    expect(input).toBeOnTheScreen()
  })
  it('uses the custom input if present', async () => {
    const placeholders: Record<string, string> = {
      'holderDetails.firstName': 'Jerry',
      'holderDetails.lastName': 'Seinfeld',
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
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const firstNameInput = await screen.findByPlaceholderText('Jerry')
    const lastNameInput = await screen.findByPlaceholderText('Seinfeld')

    expect(firstNameInput).toBeOnTheScreen()
    expect(lastNameInput).toBeOnTheScreen()
  })
  it('uses the custom birthday field if present', async () => {
    const placeholders: Record<string, string> = {
      'holderDetails.birthday': 'Birthday',
    }

    render(
      <CustomOptionsContext.Provider
        value={{
          renderDate: (name, onChangeText) => (
            <TextInput
              onChangeText={onChangeText}
              placeholder={placeholders[name]}
            />
          ),
        }}
      >
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{
            ...porting,
            birthday: null,
            required: ['birthday'],
          }}
        />
      </CustomOptionsContext.Provider>
    )

    const birthdayInput = await screen.findByPlaceholderText('Birthday')
    expect(birthdayInput).toBeOnTheScreen()

    const button = screen.getByText('Save')
    expect(button).toBeDisabled()

    fireEvent.changeText(birthdayInput, '1982-12-09')

    expect(button).not.toBeDisabled()
    fireEvent.press(button)

    expect(onSaveMock).toHaveBeenCalledWith(
      expect.objectContaining({
        birthday: '1982-12-09',
      })
    )
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
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const button = screen.getByText('Submit')
    expect(button).toBeOnTheScreen()
    expect(button).toBeDisabled()

    const firstNameInput = screen.getByText('Account Holder’s First Name')
    fireEvent.changeText(firstNameInput, 'Jeffrey')
    const lastNameInput = screen.getByText('Account Holder’s Last Name')
    fireEvent.changeText(lastNameInput, 'Seinfeld')

    expect(button).not.toBeDisabled()
    fireEvent.press(button)

    expect(onSaveMock).toHaveBeenCalledWith({
      firstName: 'Jeffrey',
      lastName: 'Seinfeld',
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
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
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
      <AccountHolderForm
        onSubmit={onSaveMock}
        porting={{ ...porting, firstName: null, lastName: null }}
      />
    )
    const banner = screen.getByText(
      'The account holder is the person who is the contractual owner of the number to be ported.'
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
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const banner = screen.getByText(
      'The account holder is the person who is the contractual owner of the number to be ported.'
    )
    expect(banner).toBeOnTheScreen()
    expect(banner).toHaveStyle({
      color: 'orange',
    })
  })
  it('displays an alert on error', () => {
    render(
      <AccountHolderForm
        onSubmit={onSaveMock}
        porting={{ ...porting, firstName: null, lastName: null }}
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
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
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
        <AccountHolderForm
          onSubmit={onSaveMock}
          porting={{ ...porting, firstName: null, lastName: null }}
        />
      </CustomOptionsContext.Provider>
    )

    const button = screen.getByText('Save')

    expect(button).toHaveStyle({
      fontFamily: 'Custom-font',
    })
  })
})
