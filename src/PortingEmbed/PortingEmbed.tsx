import React from 'react'
import { InputModeOptions } from 'react-native'

import { Porting } from '../../types/porting'
import { ConnectSessionProvider } from '../core/ConnectSessionProvider'
import { CustomOptionsProvider } from './CustomOptionsProvider'
import { PortingStep } from './nextPortingStep'
import { PortingFormContainer } from './PortingFormContainer'

type Props = {
  connectSession?: unknown
  project: string
  onLoaded?: () => unknown
  onInitialized?: () => unknown
  onError?: (error: Error) => unknown
  onCompleted: (porting: Porting) => unknown
  onSupportRequested?: () => unknown
  onPortingStep?: (portingStep: PortingStep) => unknown
  renderTitle?: (step: PortingStep) => React.ReactNode
  renderInput?: (
    name: string,
    onChange: (value: string) => void,
    inputMode?: InputModeOptions
  ) => React.ReactNode
  renderCheckbox?: (onChecked: (checked: boolean) => void) => React.ReactNode
  renderPrimaryButton?: (
    onPress: () => void,
    name?: string,
    isSubmitting?: boolean,
    disabled?: boolean
  ) => React.ReactNode
  renderSecondaryButton?: (name: string, onPress: () => void) => React.ReactNode
  renderAlertBanner?: (
    variant: 'error' | 'info',
    message: string
  ) => React.ReactNode
  renderDate?: (
    name: string,
    onChange: (value: string) => void
  ) => React.ReactNode
  renderPortingProtectionDisabledConfirmation?: (
    onConfirm: () => void
  ) => React.ReactNode
}

export function PortingEmbed({
  connectSession,
  project,
  onInitialized,
  onLoaded,
  onError,
  onCompleted,
  onSupportRequested,
  onPortingStep,
  renderTitle,
  renderInput,
  renderCheckbox,
  renderPrimaryButton,
  renderSecondaryButton,
  renderAlertBanner,
  renderDate,
  renderPortingProtectionDisabledConfirmation,
}: Props) {
  return (
    <ConnectSessionProvider
      project={project}
      supportedIntentType="completePorting"
      connectSession={connectSession}
      onInitialized={onInitialized}
      onError={onError}
    >
      <CustomOptionsProvider
        renderTitle={renderTitle}
        renderInput={renderInput}
        renderCheckbox={renderCheckbox}
        renderPrimaryButton={renderPrimaryButton}
        renderSecondaryButton={renderSecondaryButton}
        renderAlertBanner={renderAlertBanner}
        renderDate={renderDate}
        renderPortingProtectionDisabledConfirmation={
          renderPortingProtectionDisabledConfirmation
        }
      >
        <PortingFormContainer
          onLoaded={onLoaded}
          onError={onError}
          onCompleted={onCompleted}
          onSupportRequested={onSupportRequested}
          onPortingStep={onPortingStep}
        />
      </CustomOptionsProvider>
    </ConnectSessionProvider>
  )
}
