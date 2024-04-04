import type { Porting } from '../../types/porting'
import {
  declinedPortingRequiresAddress,
  declinedPortingRequiresCarrierInfo,
  declinedPortingRequiresProtectionDisabling,
  portingRequiresAddress,
  portingRequiresCarrierInfo,
  portingRequiresDonorApproval,
  portingRequiresHolderInfo,
} from './util/portingUtils'

export type PortingStep =
  | 'carrierDetails'
  | 'holderDetails'
  | 'address'
  | 'donorApproval'
  | 'protectionDisabling'
  | null

export const nextPortingStep = (porting: Porting) => {
  if (
    portingRequiresCarrierInfo(porting) ||
    declinedPortingRequiresCarrierInfo(porting)
  ) {
    return 'carrierDetails'
  }

  if (portingRequiresHolderInfo(porting)) {
    return 'holderDetails'
  }

  if (
    portingRequiresAddress(porting) ||
    declinedPortingRequiresAddress(porting)
  ) {
    return 'address'
  }

  if (portingRequiresDonorApproval(porting)) {
    return 'donorApproval'
  }

  if (declinedPortingRequiresProtectionDisabling(porting)) {
    return 'protectionDisabling'
  }

  return null
}
