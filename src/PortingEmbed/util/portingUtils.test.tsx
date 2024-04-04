import type { Porting, PortingField } from '../../../types/porting'
import {
  hasAllRequiredFieldsCompleted,
  portingRequiresCarrierInfo,
  portingRequiresDonorApproval,
  portingRequiresHolderInfo,
} from './portingUtils'

describe('portingUtils', () => {
  describe('portingRequiresCarrierInfo', () => {
    it('returns false if accountNumber is filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        accountNumber: '123456789',
        required: ['accountPin', 'accountNumber'] as PortingField[],
      }
      expect(portingRequiresCarrierInfo(candidatePorting)).toBe(false)
    })

    it('returns true if accountNumber is  not filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        accountNumber: null,
        required: ['accountPin', 'accountNumber'] as PortingField[],
      }
      expect(portingRequiresCarrierInfo(candidatePorting)).toBe(true)
    })

    it('returns true if only accountPin is required and not filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        required: ['accountPin'] as PortingField[],
      }
      expect(portingRequiresCarrierInfo(candidatePorting)).toBe(true)
    })

    it('returns false if only accountPin is required and its filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        accountPinExists: true,
        required: ['accountPin'] as PortingField[],
      }
      expect(portingRequiresCarrierInfo(candidatePorting)).toBe(false)
    })
  })

  describe('portingRequiresHolderInfo', () => {
    it('returns false if all required fields are filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        firstName: 'John',
        lastName: 'Doe',
        birthday: '2017-07-21',
        required: ['firstName', 'lastName', 'birthday'] as PortingField[],
      }
      expect(portingRequiresHolderInfo(candidatePorting)).toBe(false)
    })

    it('returns true if at least one field is not filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        firstName: null,
        lastName: 'Doe',
        birthday: '2017-07-21',
        required: ['firstName', 'lastName', 'birthday'] as PortingField[],
      }
      expect(portingRequiresHolderInfo(candidatePorting)).toBe(true)
    })
  })

  describe('hasAllRequiredFieldsCompleted', () => {
    it('returns false if at least one field is not filled out', () => {
      const porting: Porting = {
        ...portingFixture,
        required: ['accountNumber', 'firstName', 'lastName'],
        accountNumber: '1234',
        firstName: null,
        lastName: 'Robot',
      }
      const res = hasAllRequiredFieldsCompleted(porting)
      expect(res).toBe(false)
    })

    it('returns true if all required fields are filled out', () => {
      const porting: Porting = {
        ...portingFixture,
        required: ['accountNumber', 'firstName', 'accountPin'],
        accountNumber: '1234',
        firstName: 'Jerry',
        accountPinExists: true,
      }
      const res = hasAllRequiredFieldsCompleted(porting)
      expect(res).toBe(true)
    })
  })

  describe('portingRequiresDonorApproval', () => {
    it('returns false if the donorProviderApproval is filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        donorProviderApproval: true,
        required: ['donorProviderApproval'] as PortingField[],
      }
      expect(portingRequiresDonorApproval(candidatePorting)).toBe(false)
    })

    it('returns true if the donorProviderApproval is not filled out', () => {
      const candidatePorting = {
        ...portingFixture,
        donorProviderApproval: null,
        required: ['donorProviderApproval'] as PortingField[],
      }
      expect(portingRequiresDonorApproval(candidatePorting)).toBe(true)
    })
  })
})

export const portingFixture: Porting = {
  object: 'porting',
  address: null,
  id: '01G047SF9KH9P44NREW4CJG1C6',
  accountNumber: '123456789',
  birthday: '2017-07-21',
  donorProvider: {
    object: 'serviceProvider',
    id: '01G047SF9KH9P44NREW4CJG1C6',
    name: 'AT&T',
    recipientProviders: ['p3', 'test'],
  },
  donorProviderApproval: null,
  recipientProvider: {
    object: 'serviceProvider',
    id: '0ToUqsQx3l4rLP4N1IhEnXyK1k6s',
    name: 'Gigs Test Provider',
    recipientProviders: [],
  },
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '+25411865216434',
  provider: 'p4',
  required: [
    'accountNumber',
    'accountPin',
    'birthday',
    'donorProvider',
    'firstName',
    'lastName',
  ],
  status: 'informationRequired',
  subscription: '01G047TSTJT75DHTG78YDDEDD0',
  user: '01G047TSTJT75DHTG78YDDEDD0',
  createdAt: '2021-01-21T19:32:13Z',
  lastDeclinedAt: null,
  lastRequestedAt: null,
  declinedAttempts: 0,
  canceledAt: null,
  completedAt: null,
  expiredAt: null,
  accountPinExists: false,
}
