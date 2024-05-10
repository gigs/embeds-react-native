import React from 'react'
import { InputModeOptions } from 'react-native'

import { Porting } from '../../types/porting'
import { ConnectSessionProvider } from '../core/ConnectSessionProvider'
import { CustomOptionsProvider } from './CustomOptionsProvider'
import { PortingStep } from './nextPortingStep'
import { PortingFormContainer } from './PortingFormContainer'

export type PortingEmbedError = 'portingDeclined' | string

type Props = {
  connectSession?: unknown
  project: string
  onLoaded?: () => unknown
  onInitialized?: () => unknown
  onError: (
    error?: Error,
    porting?: Porting,
    errorCode?: PortingEmbedError
  ) => unknown
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
  defaultTextFont?: string
  renderProvidersDropdown?: (
    name: string,
    providers: { id: string; name: string }[],
    onChange: (value: string) => void
  ) => React.ReactNode
}

export function PortingEmbed({
  connectSession,
  project,
  onInitialized,
  onLoaded,
  onError,
  onCompleted,
  onPortingStep,
  renderTitle,
  renderInput,
  renderCheckbox,
  renderPrimaryButton,
  renderSecondaryButton,
  renderAlertBanner,
  renderDate,
  renderPortingProtectionDisabledConfirmation,
  defaultTextFont,
  renderProvidersDropdown,
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
        defaultTextFont={defaultTextFont}
        renderProvidersDropdown={renderProvidersDropdown}
        onError={onError}
      >
        <PortingFormContainer
          onLoaded={onLoaded}
          onError={onError}
          onCompleted={onCompleted}
          onPortingStep={onPortingStep}
        />
      </CustomOptionsProvider>
    </ConnectSessionProvider>
  )
}
