import { createContext, ReactNode, useContext } from 'react'
import { InputModeOptions } from 'react-native'

import { PortingStep } from './nextPortingStep'

type EmbedOptions = {
  onError?: (error: Error) => unknown
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
  renderDropdown?: (
    name: string,
    providers: { id: string; name: string }[],
    onChange: (value: string) => void
  ) => React.ReactNode
}

export const CustomOptionsContext = createContext<EmbedOptions | null>(null)

type Props = {
  children: ReactNode
} & EmbedOptions

export function CustomOptionsProvider({
  renderTitle,
  renderInput,
  renderCheckbox,
  renderPrimaryButton,
  renderSecondaryButton,
  renderAlertBanner,
  renderDate,
  renderPortingProtectionDisabledConfirmation,
  defaultTextFont,
  onError,
  renderDropdown,
  children,
}: Props) {
  return (
    <CustomOptionsContext.Provider
      value={{
        renderTitle,
        renderInput,
        renderCheckbox,
        renderPrimaryButton,
        renderSecondaryButton,
        renderAlertBanner,
        renderDate,
        renderPortingProtectionDisabledConfirmation,
        defaultTextFont,
        onError,
        renderDropdown,
      }}
    >
      {children}
    </CustomOptionsContext.Provider>
  )
}

export function useOptionsContext() {
  const ctx = useContext(CustomOptionsContext)
  return ctx
}
