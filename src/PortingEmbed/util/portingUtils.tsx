import type {
  Porting,
  PortingDeclinedCode,
  PortingField,
} from '../../../types/porting'

type PortingHolderField = Extract<PortingField, 'firstName' | 'lastName'>

type PortingCarrierField = Extract<PortingField, 'accountNumber' | 'accountPin'>

export const portingRequiresCarrierInfo = (porting: Porting) => {
  const carrierFields: PortingCarrierField[] = ['accountNumber', 'accountPin']

  const requiredCarrierFields = carrierFields.filter((field) =>
    porting.required.includes(field)
  )

  if (
    requiredCarrierFields.length === 1 &&
    requiredCarrierFields[0] === 'accountPin' &&
    !porting.accountPinExists
  ) {
    return true
  }

  const portingRequiresCarrierFields = requiredCarrierFields.length > 0

  const carrierFieldsEmpty = porting.accountNumber === null

  return portingRequiresCarrierFields && carrierFieldsEmpty
}

export const portingRequiresHolderInfo = (porting: Porting) => {
  const holderFields: PortingHolderField[] = ['firstName', 'lastName']

  return holderFields.some(
    (holderField) =>
      porting.required.includes(holderField) && porting[holderField] === null
  )
}

export const portingRequiresAddress = (porting: Porting) => {
  return porting.required.includes('address') && porting.address === null
}

export const portingRequiresDonorApproval = (porting: Porting) => {
  if (porting.status !== 'informationRequired') {
    return false
  }

  const hasApprovalRequirement = porting.required.includes(
    'donorProviderApproval'
  )
  const wasApproved = porting.donorProviderApproval

  return hasApprovalRequirement && !wasApproved
}

const portingRequiresCarrierDeclinedCodes = [
  'portingAccountNumberRequiredOrInvalid',
  'portingAccountPinRequiredOrInvalid',
] as const

const portingRequiresAddressDeclinedCodes = [
  'portingZipCodeRequiredOrInvalid',
  'portingAddressRequiredOrInvalid',
] as const

export type SelfHealingPortingDeclinedCode = Extract<
  PortingDeclinedCode,
  | (typeof portingRequiresCarrierDeclinedCodes)[number]
  | (typeof portingRequiresAddressDeclinedCodes)[number]
  | 'portingPhoneNumberPortProtected'
>

export const declinedPortingRequiresCarrierInfo = (
  porting: Pick<Porting, 'declinedCode'>
) =>
  !!porting.declinedCode &&
  portingRequiresCarrierDeclinedCodes.includes(
    porting.declinedCode as (typeof portingRequiresCarrierDeclinedCodes)[number]
  )

export const declinedPortingRequiresAddress = (
  porting: Pick<Porting, 'declinedCode'>
) =>
  !!porting.declinedCode &&
  portingRequiresAddressDeclinedCodes.includes(
    porting.declinedCode as (typeof portingRequiresAddressDeclinedCodes)[number]
  )

export const declinedPortingRequiresProtectionDisabling = (
  porting: Pick<Porting, 'declinedCode'>
) => porting.declinedCode === 'portingPhoneNumberPortProtected'

export const portingDeclinedMessage = (declinedCode: PortingDeclinedCode) => {
  switch (declinedCode) {
    case 'portingAccountNumberRequiredOrInvalid':
      return 'You entered a wrong Account Number.'
    case 'portingAccountPinRequiredOrInvalid':
      return 'You entered a wrong PIN code.'
    case 'portingPhoneNumberPortProtected':
      return 'This number is protected by an additional port protection and cannot currently be ported. Please contact your carrier to disable the port protection.'
    case 'portingZipCodeRequiredOrInvalid':
      return 'According to the provider the ZIP code was not correct.'
    case 'portingAddressRequiredOrInvalid':
      return 'According to the provider the address was not correct.'
    default:
      return 'The porting was declined. Please reach out to Customer Support.'
  }
}

export const hasAllRequiredFieldsCompleted = (porting: Porting) => {
  let isValid = true

  porting.required.forEach((field) => {
    if (field === 'firstName' && !porting.firstName) {
      isValid = false
    }
    if (field === 'lastName' && !porting.lastName) {
      isValid = false
    }
    if (field === 'accountNumber' && !porting.accountNumber) {
      isValid = false
    }
    if (field === 'accountPin' && !porting.accountPinExists) {
      isValid = false
    }
    if (field === 'address' && !porting.address) {
      isValid = false
    }
  })

  return isValid
}
