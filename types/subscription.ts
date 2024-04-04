import type { Porting } from './porting'

export type Subscription = {
  object: 'subscription'
  id: string
  porting: Porting | null
}
