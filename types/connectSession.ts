export type ConnectSession = {
  object: 'connectSession'
  id: string
  intent: ConnectSessionIntent
  callbackUrl: string | null
  url: string | null
  user: string | null
}

export type ConnectSessionIntent = CompletePortingIntent

export type CompletePortingIntent = {
  completePorting: {
    subscription: string
  }
  type: 'completePorting'
}
