import { render, screen, waitFor } from '@testing-library/react-native'
import { Button, Text, View } from 'react-native'

import { connectSession } from '../../../testing/fixtures/connectSession'
import { porting } from '../../../testing/fixtures/porting'
import { http, HttpResponse, server } from '../../../testing/http'
import { ConnectSessionContext } from '../../core/ConnectSessionProvider'
import { CustomOptionsContext } from '../CustomOptionsProvider'
import { PortingFormContainer } from '../PortingFormContainer'

describe('PortingFormContainer', () => {
  describe('when the porting is not completed', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_456',
          () => {
            return HttpResponse.json({
              id: 'sub_456',
              porting: {
                ...porting,
                accountNumber: null,
                accountPinExists: false,
              },
            })
          }
        )
      )
    })
    it('displays the relevant step', async () => {
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
          <PortingFormContainer onCompleted={jest.fn()} onError={jest.fn()} />
        </ConnectSessionContext.Provider>
      )
      await waitFor(() => {
        expect(screen.getByText('Account Number')).toBeOnTheScreen()
      })
    })
    it('returns the current porting step', async () => {
      const onPortingStep = jest.fn()

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
          <PortingFormContainer
            onCompleted={jest.fn()}
            onError={jest.fn()}
            onPortingStep={(portingStep) => onPortingStep(portingStep)}
          />
        </ConnectSessionContext.Provider>
      )

      await waitFor(() => {
        expect(onPortingStep).toBeCalledWith('carrierDetails')
      })
    })
  })
  describe('when the porting is declined with portingPhoneNumberPortProtected code', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_789',
          () => {
            return HttpResponse.json({
              id: 'sub_789',
              porting: {
                ...porting,
                declinedCode: 'portingPhoneNumberPortProtected',
              },
            })
          }
        )
      )
    })
    it('shows the PortingProtection component', async () => {
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_789',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <PortingFormContainer onCompleted={jest.fn()} onError={jest.fn()} />
        </ConnectSessionContext.Provider>
      )
      await waitFor(() => {
        expect(screen.getByText('Request Porting Again')).toBeOnTheScreen()
      })
    })
    it('shows the custom component if present', async () => {
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_789',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <CustomOptionsContext.Provider
            value={{
              renderPortingProtectionDisabledConfirmation: (onConfirm) => (
                <View>
                  <Text>
                    Confirm your number is not port protected anymore.
                  </Text>
                  <Button title={'Confirm'} onPress={onConfirm} />
                </View>
              ),
              onError: () => jest.fn,
            }}
          >
            <PortingFormContainer onCompleted={jest.fn()} onError={jest.fn()} />
          </CustomOptionsContext.Provider>
        </ConnectSessionContext.Provider>
      )
      await waitFor(() => {
        expect(
          screen.getByText('Confirm your number is not port protected anymore.')
        ).toBeOnTheScreen()
      })

      const button = screen.getByText('Confirm')
      expect(button).toBeOnTheScreen()
    })
  })
  describe('when the porting is declined with portingAccountNumberRequiredOrInvalid code', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_111',
          () => {
            return HttpResponse.json({
              id: 'sub_111',
              porting: {
                ...porting,
                declinedCode: 'portingAccountNumberRequiredOrInvalid',
              },
            })
          }
        )
      )
    })
    it('shows the carrier details form', async () => {
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_111',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <PortingFormContainer onCompleted={jest.fn()} onError={jest.fn()} />
        </ConnectSessionContext.Provider>
      )
      await waitFor(() => {
        expect(screen.getByText('Account Number')).toBeOnTheScreen()
      })
    })
  })
  describe('when the porting is declined with portingAccountPinRequiredOrInvalid code', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_222',
          () => {
            return HttpResponse.json({
              id: 'sub_222',
              porting: {
                ...porting,
                declinedCode: 'portingAccountPinRequiredOrInvalid',
              },
            })
          }
        )
      )
    })
    it('shows the carrier details form', async () => {
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_222',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <PortingFormContainer onCompleted={jest.fn()} onError={jest.fn()} />
        </ConnectSessionContext.Provider>
      )

      await waitFor(() => {
        expect(screen.getByText('Account Number')).toBeOnTheScreen()
      })
    })
  })
  describe('when the porting is declined with portingZipCodeRequiredOrInvalid code', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_333',
          () => {
            return HttpResponse.json({
              id: 'sub_333',
              porting: {
                ...porting,
                declinedCode: 'portingZipCodeRequiredOrInvalid',
              },
            })
          }
        )
      )
    })
    it('shows the address form', async () => {
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_333',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <PortingFormContainer onCompleted={jest.fn()} onError={jest.fn()} />
        </ConnectSessionContext.Provider>
      )

      await waitFor(() => {
        expect(screen.getByText('City')).toBeOnTheScreen()
      })
    })
  })
  describe('when the porting is declined with portingAddressRequiredOrInvalid code', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_444',
          () => {
            return HttpResponse.json({
              id: 'sub_444',
              porting: {
                ...porting,
                declinedCode: 'portingAddressRequiredOrInvalid',
              },
            })
          }
        )
      )
    })
    it('shows the address form', async () => {
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_444',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <PortingFormContainer onCompleted={jest.fn()} onError={jest.fn()} />
        </ConnectSessionContext.Provider>
      )

      await waitFor(() => {
        expect(screen.getByText('City')).toBeOnTheScreen()
      })
    })
  })
  describe('when the porting is declined with unsupported code', () => {
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_555',
          () => {
            return HttpResponse.json({
              id: 'sub_555',
              porting: {
                ...porting,
                status: 'declined',
                declinedCode: 'portingUserInformationMismatch',
              },
            })
          }
        )
      )
    })
    it('triggers onError', async () => {
      const onError = jest.fn()
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_555',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <PortingFormContainer onCompleted={jest.fn()} onError={onError} />
        </ConnectSessionContext.Provider>
      )

      await waitFor(() => {
        expect(onError).toBeCalledWith(new Error('Porting is declined'), {
          code: 'portingDeclined',
          porting: {
            ...porting,
            status: 'declined',
            declinedCode: 'portingUserInformationMismatch',
          },
        })
      })
    })
  })
  describe('when the porting is completed', () => {
    const onCompleted = jest.fn()
    beforeEach(() => {
      server.use(
        http.get(
          'https://api.gigs.com/projects/dev/subscriptions/sub_666',
          () => {
            return HttpResponse.json({
              id: 'sub_666',
              porting,
            })
          }
        )
      )
    })
    it('calls onCompleted', async () => {
      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_666',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '1234',
          }}
        >
          <PortingFormContainer onCompleted={onCompleted} onError={jest.fn()} />
        </ConnectSessionContext.Provider>
      )
      await waitFor(() => {
        expect(onCompleted).toHaveBeenCalled()
      })
    })
    it('returns null as a porting step', async () => {
      const onPortingStep = jest.fn()

      render(
        <ConnectSessionContext.Provider
          value={{
            connectSession: {
              ...connectSession,
              intent: {
                completePorting: {
                  subscription: 'sub_666',
                },
                type: 'completePorting',
              },
            },
            project: 'dev',
            token: '123445',
          }}
        >
          <PortingFormContainer
            onCompleted={jest.fn()}
            onError={jest.fn()}
            onPortingStep={(portingStep) => onPortingStep(portingStep)}
          />
        </ConnectSessionContext.Provider>
      )

      await waitFor(() => {
        expect(onPortingStep).toBeCalledWith(null)
      })
    })
  })
})
