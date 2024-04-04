import { ConnectSession } from '../../types/connectSession'

export const connectSession: ConnectSession = {
  object: 'connectSession',
  id: 'csn_123',
  callbackUrl: null,
  intent: {
    completePorting: {
      subscription: 'sub_12345',
    },
    type: 'completePorting',
  },
  url: 'test/portal/entry?session=csn_0SNlurA049MEWV1GWxpaE5D0t2D6&token=lzODbEyaUQjVRAmalD4pdaq5Nkn1Lw0qTL6Rdsh7PwLVES6N7ImWxnCYbJA99AXp',
  user: null,
}
