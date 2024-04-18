import { createContext, ReactNode, useContext } from 'react'
import { InputModeOptions } from 'react-native'

import { PortingStep } from './nextPortingStep'

type EmbedOptions = {
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
